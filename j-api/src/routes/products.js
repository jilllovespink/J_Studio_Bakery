import { prisma } from "../prisma.js";
import express from "express";

const r = express.Router();

console.log("Loaded products.js from:", import.meta.url);

// --- 全部商品，可帶 isAddon 篩選 ---
// GET /api/products?isAddon=true
r.get("/", async (req, res) => {
  try {
    const { isAddon, isVisible } = req.query;

    const where = {};
    // ✅ 根據參數動態篩選
    if (isAddon === "true") where.isAddon = true;
    if (isAddon === "false") where.isAddon = false;

    // 可選參數：只抓顯示商品
    if (isVisible === "true") where.isVisible = true;

    const products = await prisma.product.findMany({
      where,
      include: {
        productvariant: { orderBy: { price: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    // 整理回傳資料（含變體資訊）
    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      heroImage: p.heroImage,
      isAddon: p.isAddon,
      isVisible: p.isVisible,
      productvariant: p.productvariant.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        price: Number(v.price),
        isDefault: v.isDefault,
      })),
    }));

    res.json(mapped);
  } catch (err) {
    console.error("Failed to fetch products (general):", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// 熱門商品
// GET /api/products/hot
r.get("/hot", async (req, res) => {
  try {
    const hotProducts = await prisma.product.findMany({
      where: { isHot: true },
      include: {
        productvariant: { orderBy: { price: "asc" } },
      },
    });

    const mapped = hotProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      heroImage: p.heroImage,
      minPrice: p.productvariant[0]?.price
        ? Number(p.productvariant[0].price)
        : 0,
    }));

    console.log("Hot products:", mapped);
    res.json(mapped);
  } catch (err) {
    console.error("Failed to fetch hot products:", err);
    res.status(500).json({ error: "Failed to fetch hot products" });
  }
});

// 商品清單（可帶查詢參數）
// GET /api/products/list?category=CHILLED&search=cake&page=1&limit=12
r.get("/list", async (req, res) => {
  try {
    const { category, search, page = "1", limit = "12" } = req.query;
    const take = Math.min(parseInt(limit, 10) || 12, 20);
    const skip = ((parseInt(page, 10) || 1) - 1) * take;

    const where = { status: true };
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { productvariant: { orderBy: { price: "asc" } } },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    const mapped = items.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      heroImage: p.heroImage,
      minPrice: p.productvariant[0]?.price
        ? Number(p.productvariant[0].price)
        : 0,
    }));

    res.json({ items: mapped, page: Number(page) || 1, limit: take, total });
  } catch (err) {
    console.error("Failed to fetch products:", err);
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

// 單一商品詳情
// GET /api/products/detail/:slug
r.get("/detail/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: { productvariant: { orderBy: { price: "asc" } } },
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Product not found" } });
    }

    res.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      heroImage: product.heroImage,
      ingredients: product.ingredients,
      shelfLife: product.shelfLife,
      flavorProfile: product.flavorProfile,
      productvariants: product.productvariant.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        price: Number(v.price),
        isDefault: v.isDefault,
      })),
    });
  } catch (err) {
    console.error("Failed to fetch product detail:", err);
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

export default r;
