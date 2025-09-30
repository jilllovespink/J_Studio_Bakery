import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 驗證折扣碼
router.post("/apply", async (req, res) => {
  const { code } = req.body;

  const discount = await prisma.discount_code.findUnique({
    where: { code },
  });

  if (!discount || !discount.isActive) {
    return res.status(400).json({ valid: false, message: "折扣碼無效" });
  }

  // 檢查是否過期
  if (discount.expiresAt && new Date() > discount.expiresAt) {
    return res.status(400).json({ valid: false, message: "折扣碼已過期" });
  }

  res.json({
    valid: true,
    type: discount.type,
    value: discount.value,
  });
});

export default router;
