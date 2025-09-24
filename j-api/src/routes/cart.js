import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

/**
 * 購物車存在 session 裡
 * 每個使用者都有一個獨立的 req.session.cart
{
 *     variantId: 101,
 *     productId: 1,
 *     variantName: "6吋蛋糕",
 *     price: 500.00,
 *     quantity: 2
 *   },
 *   {
 *     variantId: 102,
 *     productId: 1,
 *     variantName: "8吋蛋糕",
 *     price: 800.00,
 *     quantity: 1
 *   } 
 */

// 查看購物車
router.get("/", (req, res) => {
  if (!req.session.cart) req.session.cart = [];
  res.json({
    items: req.session.cart,
    total: req.session.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  });
});

// 新增商品到購物車
router.post("/", async (req, res) => {
  const { variantId, quantity } = req.body;

  if (!req.session.cart) req.session.cart = [];

  // 查詢 variant 資料
  const variant = await prisma.productvariant.findUnique({
    where: { id: Number(variantId) },
    include: { product: true }, // 順便帶 product 基本資訊（例如名稱）
  });

  if (!variant) {
    return res.status(404).json({ message: "找不到這個商品規格" });
  }

  // 檢查購物車是否已有這個 variant
  const existingItem = req.session.cart.find((i) => i.variantId === variant.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    req.session.cart.push({
      variantId: variant.id,
      productId: variant.productId,
      variantName: variant.variantName,
      price: Number(variant.price), // Prisma Decimal 轉數字
      quantity,
    });
  }

  res.json({
    items: req.session.cart,
    total: req.session.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  });
});

// 更新商品數量
router.put("/:variantId", (req, res) => {
  const { variantId } = req.params;
  const { quantity } = req.body;

  if (!req.session.cart)
    return res.status(400).json({ message: "購物車是空的" });

  const item = req.session.cart.find((i) => i.variantId === Number(variantId));

  if (item) {
    item.quantity = quantity;
    res.json({
      items: req.session.cart,
      total: req.session.cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    });
  } else {
    res.status(404).json({ message: "找不到該商品" });
  }
});

// 刪除單一商品
router.delete("/:variantId", (req, res) => {
  const { variantId } = req.params;
  if (!req.session.cart)
    return res.status(400).json({ message: "購物車是空的" });

  req.session.cart = req.session.cart.filter(
    (i) => i.variantId !== Number(variantId)
  );

  res.json({
    items: req.session.cart,
    total: req.session.cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
  });
});

// 清空購物車
router.delete("/", (req, res) => {
  req.session.cart = [];
  res.json({ items: [], total: 0 });
});

export default router;
