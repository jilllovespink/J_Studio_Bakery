import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

// 取得所有 Banner
router.get("/", async (req, res) => {
  try {
    const banners = await prisma.banners.findMany({
      orderBy: { id: "asc" },
    });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 新增 Banner
router.post("/", async (req, res) => {
  try {
    const { image, title, buttonText, buttonLink } = req.body;
    const banners = await prisma.banners.create({
      data: { image, title, buttonText, buttonLink },
    });
    res.status(201).json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 更新 Banner
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, buttonText, buttonLink } = req.body;
    const banners = await prisma.banners.update({
      where: { id: Number(id) },
      data: { image, title, buttonText, buttonLink },
    });
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// 刪除 Banner
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.banners.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Banner deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
