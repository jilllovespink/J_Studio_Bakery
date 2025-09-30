import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 取得加購商品列表
router.get("/", async (req, res) => {
  const addons = await prisma.addon_product.findMany({
    where: { status: true },
  });
  res.json(addons);
});

export default router;
