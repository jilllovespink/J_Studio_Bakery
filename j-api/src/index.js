import express from "express";
import cors from "cors";
import "dotenv/config";

// 路由
import products from "./routes/products.js";
import allproducts from "./routes/allproducts.js";
import orders from "./routes/orders.js";
import banner from "./routes/banners.js";
import newsRouter from "./routes/news.js";
import categories from "./routes/categories.js";
import subcategories from "./routes/subcategories.js";
import cart from "./routes/cart.js";
import { sessionMiddleware } from "./middlewares/session.js";

const app = express();

// 啟用 CORS，允許前端 (http://localhost:5173) 帶 cookie
app.use(
  cors({
    origin: "http://localhost:5173", // 你的 Vue 前端開發伺服器
    credentials: true, // 允許攜帶 cookie
  })
);

// 解析 JSON 請求 body
app.use(express.json());

// 啟用 Session Middleware
app.use(sessionMiddleware);

// 測試 Session 是否正常
app.get("/api/test-session", (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }
  res.json({ views: req.session.views });
});

app.use("/api/products", products);
app.use("/api/allproducts", allproducts);
app.use("/api/orders", orders);
app.use("/api/banners", banner);
app.use("/api/news", newsRouter);
app.use("/api/categories", categories);
app.use("/api/subcategories", subcategories);
app.use("/api/cart", cart);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
