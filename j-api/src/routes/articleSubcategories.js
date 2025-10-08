import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

// 取得某子分類下的文章
// GET /api/article-subcategories/:id/articles
router.get("/:id/articles", async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await prisma.article.findMany({
      where: { subCategoryId: Number(id) },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        publishedAt: true,
        category: { select: { id: true, name: true, slug: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
      },
    });
    res.json(articles);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

export default router;
