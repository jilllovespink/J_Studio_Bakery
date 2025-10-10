import { Router } from "express";
import { prisma } from "../prisma.js";

const r = Router();

/**
 * 取得全部文章
 * 包含大分類 & 子分類
 */
r.get("/", async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

/**
 * 依子分類 ID 抓文章清單
 */
r.get("/by-subcategory/:subId", async (req, res) => {
  try {
    const subId = parseInt(req.params.subId, 10);
    const articles = await prisma.article.findMany({
      where: { subCategoryId: subId },
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch articles by subcategory" });
  }
});

/**
 * 依大分類 ID 抓文章清單
 */
r.get("/by-category/:catId", async (req, res) => {
  try {
    const catId = parseInt(req.params.catId, 10);
    const articles = await prisma.article.findMany({
      where: { categoryId: catId },
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: { publishedAt: "desc" },
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch articles by category" });
  }
});

/**
 * 依照 slug 抓單篇文章（含 content）
 * 提供前端文章詳情頁使用
 */
r.get("/:slug", async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        subcategory: true,
      },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});
/**
 * 依照 slug 抓單篇文章（含 content）
 * 提供前端文章詳情頁使用
 */
r.get("/:slug", async (req, res) => {
  try {
    const article = await prisma.article.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        subcategory: true,
      },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

export default r;
