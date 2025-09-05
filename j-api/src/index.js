// import { prisma } from "./prisma.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import products from "./routes/products.js";
import orders from "./routes/orders.js";
import banner from "./routes/banners.js";

console.log("載入的 products router:", products);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", products);
app.use("/api/orders", orders);
app.use("/api/banners", banner);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
