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

export default r;
