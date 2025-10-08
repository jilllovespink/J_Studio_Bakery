import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

// 取得所有文章大分類
// GET /api/article-categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.articleCategory.findMany({
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        orderIndex: true,
      },
    });
    res.json(categories);
  } catch (err) {
    console.error("Error fetching article categories:", err);
    res.status(500).json({ error: "Failed to fetch article categories" });
  }
});

// 取得某大分類的子分類
// GET /api/article-categories/:id/subcategories
router.get("/:id/subcategories", async (req, res) => {
  try {
    const { id } = req.params;
    const subcategories = await prisma.articleSubCategory.findMany({
      where: { categoryId: Number(id) },
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        orderIndex: true,
      },
    });
    res.json(subcategories);
  } catch (err) {
    console.error("Error fetching article subcategories:", err);
    res.status(500).json({ error: "Failed to fetch article subcategories" });
  }
});

export default router;
