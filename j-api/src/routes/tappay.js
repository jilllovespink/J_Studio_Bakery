import { Router } from "express";
import axios from "axios";
import { prisma } from "../prisma.js";

const r = Router();

const APP_KEY =
  "app_xMENquzDbwYyniL02tCaswjO6xhDjnvcSMcMjbO2iJTbtUaIGUZ859Vrr5x0"; // TapPay sandbox AppKey
const MERCHANT_ID = "JStudio_FUBON_POS_3"; // TapPay sandbox merchant_id

// TapPay 付款 API
r.post("/pay", async (req, res) => {
  try {
    const { prime, orderNo } = req.body;

    // 1. 從資料庫取出訂單金額
    const order = await prisma.order.findUnique({
      where: { orderNo },
    });
    if (!order) {
      return res.status(404).json({ success: false, message: "訂單不存在" });
    }

    // 2. 呼叫 TapPay Pay by Prime API
    const result = await axios.post(
      "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
      {
        prime,
        partner_key: APP_KEY,
        merchant_id: MERCHANT_ID,
        details: `J Studio 訂單 ${orderNo}`,
        amount: order.totalAmount, // 用資料庫金額
        cardholder: {
          phone_number: order.phone,
          name: order.buyerName,
          email: order.email,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": APP_KEY,
        },
      }
    );

    const data = result.data;
    console.log("TapPay response:", data);

    // 3. 更新資料庫訂單狀態 & 存交易結果
    await prisma.order.update({
      where: { orderNo },
      data: {
        status: data.status === 0 ? "PAID" : "FAILED",
        paymentMethod: "TAPPAY_CREDIT",
        paymentInfo: data,
      },
    });

    if (data.status === 0) {
      return res.json({ success: true, message: "付款成功", data });
    } else {
      return res.status(400).json({ success: false, message: data.msg, data });
    }
  } catch (err) {
    console.error("TapPay error:", err.response?.data || err.message);
    return res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default r;
