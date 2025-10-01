import { Router } from "express";
import { prisma } from "../prisma.js";
import { z } from "zod";
import crypto from "crypto";

const r = Router();

// 驗證 DTO（最小夠用）
const CreateOrderDTO = z.object({
  buyer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(8),
    address: z.string().min(5),
  }),
  shippingMethod: z.enum(["BLACKCAT", "PICKUP"]),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        variantId: z.number().int().positive().optional(),
        qty: z.number().int().positive(),
        addOns: z
          .array(
            z.object({
              type: z.string(),
              qty: z.number().int().positive(),
              price: z.number().nonnegative(),
            })
          )
          .optional(),
      })
    )
    .min(1),
});

// 產生可讀訂單編號（外顯用）
function makeOrderNo() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(d.getDate()).padStart(2, "0")}`;
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `JUEAN-${ymd}-${rand}`;
}

r.get("/health", (req, res) => res.json({ ok: true }));

// 建立訂單（未導轉金流）
r.post("/", async (req, res) => {
  try {
    const parsed = CreateOrderDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: parsed.error.message },
      });
    }
    const { buyer, shippingMethod, items } = parsed.data;

    // 1) 從 DB 取回商品/規格做「伺服端重新計價」
    const productIds = items.map((i) => i.productId);
    const variantIds = items.map((i) => i.variantId).filter(Boolean);

    const [products, variants] = await Promise.all([
      prisma.product.findMany({ where: { id: { in: productIds } } }),
      prisma.productVariant.findMany({ where: { id: { in: variantIds } } }),
    ]);

    const productMap = new Map(products.map((p) => [p.id, p]));
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    let subtotal = 0;
    const orderItemsData = [];

    for (const it of items) {
      const p = productMap.get(it.productId);
      if (!p) {
        return res.status(400).json({
          error: {
            code: "NOT_FOUND",
            message: `Product ${it.productId} not found`,
          },
        });
      }

      let price = 0;

      if (it.variantId) {
        const v = variantMap.get(it.variantId);
        if (!v || v.productId !== p.id) {
          return res.status(400).json({
            error: {
              code: "INVALID_VARIANT",
              message: "Variant not match product",
            },
          });
        }
        price = Number(v.price);
      } else {
        const def = await prisma.productVariant.findFirst({
          where: { productId: p.id, isDefault: true },
        });
        if (!def)
          return res.status(400).json({
            error: { code: "NO_DEFAULT", message: "No default variant" },
          });
        price = Number(def.price);
      }

      const addOnTotal = (it.addOns || []).reduce(
        (s, a) => s + a.price * a.qty,
        0
      );
      const line = price * it.qty + addOnTotal;
      subtotal += line;

      orderItemsData.push({
        productId: p.id,
        variantId: it.variantId ?? null,
        qty: it.qty,
        unitPrice: price,
        addOnJson: it.addOns || null,
      });
    }

    // 運費規則：滿 2000 免運；否則 160（MVP 先簡化）
    const shippingFee = subtotal >= 2000 ? 0 : 160;
    const discount = 0;
    const totalAmount = subtotal + shippingFee - discount;

    // 2) 寫入訂單（狀態 PENDING）
    const orderNo = makeOrderNo();
    const order = await prisma.order.create({
      data: {
        orderNo,
        buyerName: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        address: buyer.address,
        shippingMethod,
        subtotal,
        shippingFee,
        discount,
        totalAmount,
        status: "PENDING",
        paymentMethod: "ECPAY_CREDIT",
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    // 3) 回傳（先不導轉金流，之後再加 ECPay 欄位）
    return res.status(201).json({
      orderNo: order.orderNo,
      amount: Number(order.totalAmount),
      status: order.status,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: { code: "INTERNAL_ERROR", message: "Server error" } });
  }
});

export default r;
