import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 取得所有大分類
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.product_category.findMany({
      orderBy: { orderIndex: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        orderIndex: true,
      },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// 取得某大分類的子分類
router.get("/:id/subcategories", async (req, res) => {
  try {
    const { id } = req.params;
    const subcategories = await prisma.product_subcategory.findMany({
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
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
});

export default router;
