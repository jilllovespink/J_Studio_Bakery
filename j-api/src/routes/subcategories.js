import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 取得某子分類的商品
router.get("/:id/products", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await prisma.product.findMany({
      where: {
        subcategoryId: Number(id),
        status: true, // 僅顯示上架商品
        isVisible: true, // 僅顯示可見商品
        isAddon: false,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        heroImage: true,
        isHot: true,
        isAddon: true,
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
