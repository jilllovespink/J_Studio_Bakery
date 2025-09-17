import { prisma } from "../prisma.js";
import express from "express";

const r = express.Router();

// GET /api/products
r.get("/", async (req, res) => {
  const products = await prisma.product.findMany({
    include: { productvariant: { orderBy: { price: "asc" } } },
  });
  res.json(products);
});

export default r;
