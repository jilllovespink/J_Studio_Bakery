import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 取得某子分類的商品
router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await prisma.product.findMany({
      where: { subcategoryId: Number(id) },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        heroImage: true,
        isHot: true,
        productvariant: {
          select: {
            id: true,
            variantName: true,
            price: true,
            isDefault: true,
          },
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

export default router;
