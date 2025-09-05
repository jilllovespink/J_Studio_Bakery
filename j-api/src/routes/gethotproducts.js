import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 取得熱門商品 (isHot = true)
router.get("/", async (req, res) => {
  try {
    const hotProducts = await prisma.product.findMany({
      where: { isHot: true },
    });
    res.json(hotProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hot products" });
  }
});

export default router;
