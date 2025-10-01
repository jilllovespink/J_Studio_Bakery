import { Router } from "express";
import { prisma } from "../prisma.js";
import crypto from "crypto";
import qs from "qs";

const MERCHANT_ID = "3002607";
const HASH_KEY = "pwFHCqoQZGmho4w6";
const HASH_IV = "EkRm7iFT261dpevs";

// 產生檢查碼函式
function generateCheckMacValue(params) {
  const sorted = Object.keys(params)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {});

  let query = `HashKey=${HASH_KEY}&${qs.stringify(sorted)}&HashIV=${HASH_IV}`;
  query = encodeURIComponent(query).toLowerCase();
  return crypto.createHash("md5").update(query).digest("hex").toUpperCase();
}

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
    const { buyer, shippingMethod, items } = req.body;

    // 簡單驗證（更嚴格驗證已經在前端做過）
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

    // 運費 (前端已經有設定: home=190, pickup=0)
    const shippingFee = shippingMethod === "home" ? 190 : 0;

    // 折扣處理
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
        paymentMethod: "ECPAY_CREDIT", // 先固定，之後再接綠界
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

    // === 新增：產生綠界參數 ===
    const tradeDate = new Date()
      .toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
      .replace(/\//g, "/");

    const baseParams = {
      MerchantID: MERCHANT_ID,
      MerchantTradeNo: order.orderNo, // 用 DB 訂單號
      MerchantTradeDate: tradeDate,
      PaymentType: "aio",
      TotalAmount: Number(order.totalAmount),
      TradeDesc: "J Studio 訂單付款",
      ItemName: order.orderitem
        .map((it) => `商品${it.productId}x${it.qty}`)
        .join("#"),
      ReturnURL: "https://你的後端/api/ecpay/callback", // 後端通知
      ClientBackURL: "http://localhost:5173/payment-success", // 前端導回
      ChoosePayment: "Credit",
    };

    const CheckMacValue = generateCheckMacValue(baseParams);

    const form = { ...baseParams, CheckMacValue };

    return res.status(201).json({
      orderNo: order.orderNo,
      amount: Number(order.totalAmount),
      status: order.status,
      ecpay: {
        action: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5",
        params: form,
      },
    });
  } catch (err) {
    console.error("建立訂單失敗", err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

export default r;
