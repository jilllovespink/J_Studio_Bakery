import { Router } from "express";
import { prisma } from "../prisma.js";

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
r.post("/", async (req, res) => {
  try {
    const { buyer, shippingMethod, items, paymentMethod } = req.body;

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
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: { code: "NO_ITEMS", message: "訂單必須包含至少一項商品" },
      });
    }

    // 小計
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

    // 運費
    const shippingFee = shippingMethod === "home" ? 190 : 0;

    // 折扣處理（假設你之後會做優惠碼）
    let discountAmount = 0;
    if (req.session?.discount) {
      const d = req.session.discount;
      if (d.type === "fixed") {
        discountAmount = d.value;
      } else if (d.type === "percent") {
        discountAmount = Math.floor(subtotal * (d.value / 100));
      }
    }

    const totalAmount = subtotal + shippingFee - discountAmount;

    // 產生訂單編號
    const orderNo = await generateOrderNo();

    // 寫入資料庫
    const order = await prisma.order.create({
      data: {
        orderNo,
        buyerName: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        shippingMethod,
        subtotal,
        shippingFee,
        discount: discountAmount,
        totalAmount,
        status: "PENDING",
        paymentMethod: paymentMethod || "CASH", // 預設 CASH，可由前端傳 "TAPPAY_CREDIT"
        orderitem: {
          create: items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId,
            qty: it.quantity,
            unitPrice: it.price,
          })),
        },
      },
      include: { orderitem: true },
    });

    return res.status(201).json({
      orderNo: order.orderNo,
      amount: Number(order.totalAmount),
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
      discount: order.discount,
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
