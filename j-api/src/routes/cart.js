import { prisma } from "../prisma.js";
import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// 運送方式與運費設定
const shippingOptions = {
  home: { label: "宅配", fee: 190 },
  pickup: { label: "門市自取", fee: 0 },
};

// 計算購物車總結
function calculateSummary(cart, discount, shippingMethod) {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // 折扣
  let discountAmount = 0;
  if (discount) {
    discountAmount =
      discount.type === "fixed"
        ? discount.value
        : Math.floor(subtotal * (discount.value / 100));
  }

  // 運費
  const shippingFee = shippingOptions[shippingMethod]?.fee || 0;
  const total = subtotal - discountAmount + shippingFee;

  return {
    subtotal,
    discountAmount,
    shippingFee,
    total,
    shippingMethod,
  };
}

// 統一取購物車
async function getOrCreateCart(guestId) {
  return await prisma.cart.upsert({
    where: { guestId },
    update: {},
    create: { guestId },
    include: { items: true },
  });
}

// 統一回傳購物車
function respondWithCart(cart, res, discount, shippingMethod) {
  res.json({
    items: cart.items,
    summary: calculateSummary(cart.items, discount, shippingMethod),
  });
}

// 查看購物車
router.get("/", verifyToken, async (req, res) => {
  const guestId = req.user.guestId;
  const cart = await getOrCreateCart(guestId);
  respondWithCart(cart, res, cart.discount, cart.shippingMethod || "home");
});

// 新增商品
router.post("/", verifyToken, async (req, res) => {
  const { variantId, quantity } = req.body;
  const guestId = req.user.guestId;

  const variant = await prisma.productvariant.findUnique({
    where: { id: Number(variantId) },
    include: { product: true },
  });
  if (!variant) return res.status(404).json({ message: "找不到這個商品規格" });

  const cart = await getOrCreateCart(guestId);

  // 檢查是否已存在
  const existing = cart.items.find((i) => i.variantId === variant.id);
  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: guestId,
        variantId: variant.id,
        productId: variant.productId,
        productName: variant.product.name,
        variantName: variant.variantName,
        productImg: variant.product.heroImage,
        price: Number(variant.price),
        quantity,
      },
    });
  }

  const updated = await getOrCreateCart(guestId);
  respondWithCart(
    updated,
    res,
    updated.discount,
    updated.shippingMethod || "home"
  );
});

// 更新數量
router.put("/:variantId", verifyToken, async (req, res) => {
  const { variantId } = req.params;
  const { quantity } = req.body;
  const guestId = req.user.guestId;

  const cart = await getOrCreateCart(guestId);
  const item = cart.items.find((i) => i.variantId == variantId);
  if (!item) return res.status(404).json({ message: "找不到該商品" });

  await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  const updated = await getOrCreateCart(guestId);
  respondWithCart(
    updated,
    res,
    updated.discount,
    updated.shippingMethod || "home"
  );
});

router.post("/set-discount", verifyToken, async (req, res) => {
  const { code } = req.body;
  const guestId = req.user.guestId;

  try {
    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "缺少或無效的折扣碼" });
    }

    // 檢查折扣碼是否存在與啟用
    const discount = await prisma.discount_code.findUnique({ where: { code } });

    if (!discount) {
      return res.status(404).json({ message: "折扣碼不存在" });
    }

    if (!discount.isActive) {
      return res.status(400).json({ message: "折扣碼未啟用" });
    }

    // 檢查是否過期
    if (discount.expiresAt && new Date() > discount.expiresAt) {
      return res.status(400).json({ message: "折扣碼已過期" });
    }

    // 檢查折扣類型是否合法
    if (!["percent", "fixed"].includes(discount.type)) {
      return res.status(400).json({ message: "折扣碼類型錯誤" });
    }

    // 更新購物車（寫入折扣資料）
    await prisma.cart.update({
      where: { guestId },
      data: {
        discountType: discount.type,
        discountValue: discount.value,
      },
    });

    // 回傳最新購物車
    const updatedCart = await getOrCreateCart(guestId);
    respondWithCart(
      updatedCart,
      res,
      { type: discount.type, value: discount.value },
      updatedCart.shippingMethod || "home"
    );
  } catch (err) {
    console.error("❌ [POST /cart/set-discount] error:", err);
    res.status(500).json({
      message: "伺服器錯誤，請稍後再試",
      error: err.message,
    });
  }
});

// 刪除商品
router.delete("/:variantId", verifyToken, async (req, res) => {
  const { variantId } = req.params;
  const guestId = req.user.guestId;

  const cart = await getOrCreateCart(guestId);
  const item = cart.items.find((i) => i.variantId == variantId);
  if (!item) return res.status(404).json({ message: "找不到該商品" });

  await prisma.cartItem.delete({ where: { id: item.id } });
  const updated = await getOrCreateCart(guestId);
  respondWithCart(
    updated,
    res,
    updated.discount,
    updated.shippingMethod || "home"
  );
});

// 清空購物車
router.delete("/", verifyToken, async (req, res) => {
  const guestId = req.user.guestId;
  await prisma.cartItem.deleteMany({ where: { cartId: guestId } });
  const updated = await getOrCreateCart(guestId);
  respondWithCart(updated, res, null, "home");
});

export default router;
