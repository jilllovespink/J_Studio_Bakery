import { Router } from "express";
import { prisma } from "../prisma.js";
import { verifyToken } from "../middlewares/auth.js";

const r = Router();

// --- 訂單編號：日期 + 當日流水號 ---
async function generateOrderNo() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getDate()).padStart(2, "0")}`;

  // 當天起訖時間
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);

  const end = new Date(d);
  end.setHours(23, 59, 59, 999);

  // 當天已存在的訂單數量
  const countToday = await prisma.order.count({
    where: {
      createdAt: {
        gte: start,
        lt: end,
      },
    },
  });
  // 編號 = yyyymmdd + 四位數流水號
  const serial = String(countToday + 1).padStart(4, "0");
  return `${ymd}${serial}`;
}

// --- 建立訂單 ---
r.post("/", verifyToken, async (req, res) => {
  try {
    const { buyer, shippingMethod, paymentMethod } = req.body;
    const guestId = req.user.guestId;

    //  取得購物車
    const cart = await prisma.cart.findUnique({
      where: { guestId },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ error: { code: "EMPTY_CART", message: "購物車是空的" } });
    }

    // 簡單驗證
    if (!buyer?.name || !buyer?.email || !buyer?.phone) {
      return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "缺少必要的訂購人資訊" },
      });
    }
    if (!["home", "pickup"].includes(shippingMethod)) {
      return res.status(400).json({
        error: { code: "INVALID_SHIPPING", message: "運送方式不正確" },
      });
    }

    // 小計
    const subtotal = cart.items.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    // 計算折扣
    let discountAmount = 0;
    if (cart.discountType && cart.discountValue) {
      if (cart.discountType === "fixed") {
        discountAmount = cart.discountValue;
      } else if (cart.discountType === "percent") {
        discountAmount = Math.floor(subtotal * (cart.discountValue / 100));
      }
    }

    // 運費
    const shippingFee = shippingMethod === "home" ? 190 : 0;

    const totalAmount = subtotal + shippingFee - discountAmount;

    // 產生訂單編號
    const orderNo = await generateOrderNo();

    // 寫入資料庫
    const order = await prisma.order.create({
      data: {
        orderNo,
        guestId,
        buyerName: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        shippingMethod,
        shipDate: buyer.shipDate ? new Date(buyer.shipDate) : null,
        subtotal,
        shippingFee,
        discountType: cart.discountType || null,
        discountValue: cart.discountValue || null,
        discountAmount,
        totalAmount,
        status: "PENDING",
        paymentMethod: paymentMethod || "CASH", // 預設 CASH，可由前端傳 "TAPPAY_CREDIT"
        orderitem: {
          create: cart.items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId,
            qty: it.quantity,
            unitPrice: it.price,
          })),
        },
      },
      include: { orderitem: true },
    });

    // 清空購物車（但保留 guestId）
    await prisma.cartItem.deleteMany({ where: { cartId: guestId } });
    await prisma.cart.update({
      where: { guestId },
      data: { discountType: null, discountValue: null },
    });

    return res.status(201).json({
      orderNo: order.orderNo,
      amount: Number(order.totalAmount),
      discountAmount,
      status: order.status,
    });
  } catch (err) {
    console.error("建立訂單失敗", err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

// --- 更新付款狀態 (付款成功後呼叫) ---
r.patch("/:orderNo/pay", async (req, res) => {
  try {
    const { orderNo } = req.params;
    const { paymentResult } = req.body;
    // paymentResult 可以帶 TapPay 回傳的資訊 (例如交易序號、授權碼)

    // 先確認訂單是否存在
    const order = await prisma.order.findUnique({ where: { orderNo } });
    if (!order) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "找不到訂單" },
      });
    }

    // 已付款就不要重複更新
    if (order.status === "PAID") {
      return res.json({
        message: "訂單已付款",
        orderNo: order.orderNo,
        status: order.status,
      });
    }

    // 更新訂單狀態為已付款
    const updated = await prisma.order.update({
      where: { orderNo },
      data: {
        status: "PAID",
        paymentInfo: paymentResult ? JSON.stringify(paymentResult) : null,
        paidAt: new Date(),
      },
    });

    return res.json({
      message: "付款成功，訂單狀態已更新",
      orderNo: updated.orderNo,
      status: updated.status,
    });
  } catch (err) {
    console.error("更新付款狀態失敗", err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

// --- 取得訂單 ---
r.get("/:orderNo", async (req, res) => {
  try {
    const { orderNo } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNo },
      include: {
        orderitem: {
          include: {
            product: true, // 假設你有關聯 product table
            productvariant: true, // 假設你有關聯 variant table
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "找不到訂單" },
      });
    }

    return res.json({
      orderNo: order.orderNo,
      buyerName: order.buyerName,
      phone: order.phone,
      email: order.email,
      shippingMethod: order.shippingMethod,
      address: order.address,
      shipDate: order.shipDate,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discountType: order.discountType,
      discountValue: order.discountValue,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      status: order.status, // PENDING / PAID
      paymentMethod: order.paymentMethod,
      orderitem: order.orderitem.map((it) => ({
        id: it.id,
        productId: it.productId,
        productName: it.product?.name || "未知商品",
        variantId: it.variantId,
        variantName: it.variant?.name || null,
        qty: it.qty,
        unitPrice: it.unitPrice,
      })),
    });
  } catch (err) {
    console.error("查詢訂單失敗", err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

export default r;
