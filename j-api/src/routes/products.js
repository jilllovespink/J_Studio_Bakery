import { Router } from "express";
import { prisma } from "../prisma.js";

const r = Router();

// GET /api/products?category=CHILLED&q=cake&page=1&limit=12
r.get("/", async (req, res) => {
  try {
    // 1) 取出查詢參數（字串）並處理預設值/上限
    const { category, search, page = "1", limit = "12" } = req.query;
    const take = Math.min(parseInt(limit, 10) || 12, 20); // 單頁最多給 20 筆
    const skip = ((parseInt(page, 10) || 1) - 1) * take;

    // 2) 組 Prisma 的 where 條件
    //   - 先只取上架商品（status=true）
    //   - category（若使用者有給）
    //   - q（關鍵字，這裡用 contains；MySQL 多數預設是 case-insensitive）
    const where = { status: true };
    if (category) where.category = category;

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }
    // 3) 兩件事一起做：取清單 + 取總數（for 分頁）
    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          // 取規格並按價格由低到高排，等下好抓「最小價格」
          variants: { orderBy: { price: "asc" } },
        },
        orderBy: { createdAt: "desc" }, // 新的在前
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    // 4) 整理回應：Decimal 轉 Number，補 minPrice
    const mapped = items.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      heroImage: p.heroImage,
      minPrice: p.variants[0]?.price ? Number(p.variants[0].price) : 0,
    }));

    // 5) 回傳統一格式（含分頁資訊）
    res.json({ items: mapped, page: Number(page) || 1, limit: take, total });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});
// GET /api/products/:slug → 單一商品詳情
r.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: { orderBy: { price: "asc" } },
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Product not found" } });
    }

    // 整理回傳格式
    res.json({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      description: product.description,
      heroImage: product.heroImage,
      variants: product.variants.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        price: Number(v.price),
        isDefault: v.isDefault,
      })),
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

export default r;
