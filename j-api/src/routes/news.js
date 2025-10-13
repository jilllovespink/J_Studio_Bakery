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
// 取得單篇最新消息
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const newsItem = await prisma.news.findUnique({
      where: { id },
    });

    if (!newsItem) {
      return res.status(404).json({ error: "News not found" });
    }

    res.json(newsItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news item" });
  }
});

export default router;
