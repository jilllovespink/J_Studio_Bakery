import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 取得全部最新消息 (依日期排序，最新在前)
router.get("/", async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: "desc" },
    });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

export default router;
