import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 運送方式與運費設定
const shippingOptions = {
  home: { label: "宅配", fee: 190 },
  pickup: { label: "門市自取", fee: 0 },
};

// 計算購物車總結
function calculateSummary(cart, discount, shippingMethod) {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 折扣
  let discountAmount = 0;
  if (discount) {
    if (discount.type === "fixed") {
      discountAmount = discount.value;
    } else if (discount.type === "percent") {
      discountAmount = Math.floor(subtotal * (discount.value / 100));
    }
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

// 統一回傳購物車狀態
function respondWithCart(req, res) {
  if (!req.session.cart) req.session.cart = [];
  return res.json({
    items: req.session.cart,
    summary: calculateSummary(
      req.session.cart,
      req.session.discount,
      req.session.shippingMethod || "home"
    ),
  });
}

// 查看購物車
router.get("/", (req, res) => {
  respondWithCart(req, res);
});

// 新增商品到購物車
router.post("/", async (req, res) => {
  const { variantId, quantity } = req.body;

  if (!req.session.cart) req.session.cart = [];

  // 查詢 variant 資料
  const variant = await prisma.productvariant.findUnique({
    where: { id: Number(variantId) },
    include: { product: true }, // 順便帶 product 基本資訊（例如名稱）
  });

  if (!variant) {
    return res.status(404).json({ message: "找不到這個商品規格" });
  }

  // 檢查購物車是否已有這個 variant
  const existingItem = req.session.cart.find((i) => i.variantId === variant.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    req.session.cart.push({
      variantId: variant.id,
      productImg: variant.product.heroImage,
      productId: variant.productId,
      productName: variant.product.name,
      variantName: variant.variantName,
      price: Number(variant.price), // Prisma Decimal 轉數字
      quantity,
    });
  }

  respondWithCart(req, res);
});

// 更新商品數量
router.put("/:variantId", (req, res) => {
  const { variantId } = req.params;
  const { quantity } = req.body;

  if (!req.session.cart)
    return res.status(400).json({ message: "購物車是空的" });

  const item = req.session.cart.find((i) => i.variantId == variantId);
  if (!item) return res.status(404).json({ message: "找不到該商品" });

  item.quantity = quantity;
  respondWithCart(req, res);
});

// 刪除單一商品
router.delete("/:variantId", (req, res) => {
  const { variantId } = req.params;
  if (!req.session.cart)
    return res.status(400).json({ message: "購物車是空的" });

  req.session.cart = req.session.cart.filter((i) => i.variantId != variantId);
  respondWithCart(req, res);
});

// 設定折扣碼
router.post("/set-discount", async (req, res) => {
  const { code } = req.body;

  // 1. 檢查折扣碼是否存在、是否啟用
  const discount = await prisma.discount_code.findUnique({
    where: { code },
  });

  if (!discount || !discount.isActive) {
    return res.status(400).json({ message: "折扣碼無效" });
  }

  // 2. 檢查是否過期
  if (discount.expiresAt && new Date() > discount.expiresAt) {
    return res.status(400).json({ message: "折扣碼已過期" });
  }

  // 3. 存進 session
  req.session.discount = {
    type: discount.type,
    value: discount.value,
  };

  // 4. 回傳最新購物車狀態
  respondWithCart(req, res);
});

// 設定取貨方式
router.post("/set-shipping", (req, res) => {
  const { method } = req.body;

  if (!shippingOptions[method]) {
    return res.status(400).json({ message: "無效的取貨方式" });
  }

  req.session.shippingMethod = method;
  respondWithCart(req, res);
});

// 新增加購商品到購物車
router.post("/addon", async (req, res) => {
  const { addonId, quantity } = req.body;

  const addon = await prisma.addon_product.findUnique({
    where: { id: Number(addonId) },
  });

  if (!addon) return res.status(404).json({ message: "找不到加購品" });

  if (!req.session.cart) req.session.cart = [];

  req.session.cart.push({
    variantId: `addon-${addon.id}`, // 確保不跟一般商品衝突
    productName: addon.name,
    price: addon.price,
    quantity,
    productImg: addon.imageUrl,
    variantName: "加購品",
  });

  respondWithCart(req, res);
});

// 清空購物車
router.delete("/", (req, res) => {
  req.session.cart = [];
  req.session.discount = null;
  req.session.shippingMethod = "home";
  respondWithCart(req, res);
});

export default router;
