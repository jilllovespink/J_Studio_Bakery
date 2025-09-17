// import { prisma } from "./prisma.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import products from "./routes/products.js";
import allproducts from "./routes/allproducts.js";
import orders from "./routes/orders.js";
import banner from "./routes/banners.js";
import newsRouter from "./routes/news.js";
import categories from "./routes/categories.js";
import subcategories from "./routes/subcategories.js";

console.log("載入的 products router:", products);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/products", products);
app.use("/api/allproducts", allproducts);
app.use("/api/orders", orders);
app.use("/api/banners", banner);
app.use("/api/news", newsRouter);
app.use("/api/categories", categories);
app.use("/api/subcategories", subcategories);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
