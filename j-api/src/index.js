import express from "express";
import cors from "cors";
import "dotenv/config";

// 路由
import products from "./routes/products.js";
import allproducts from "./routes/allproducts.js";
import orders from "./routes/orders.js";
import banner from "./routes/banners.js";
import news from "./routes/news.js";
import categories from "./routes/categories.js";
import subcategories from "./routes/subcategories.js";
import cart from "./routes/cart.js";
import discounts from "./routes/discounts.js";
import addons from "./routes/addons.js";
import tappay from "./routes/tappay.js";
import articles from "./routes/articles.js";
import articleCategories from "./routes/articleCategories.js";
import articleSubcategories from "./routes/articleSubcategories.js";

import { sessionMiddleware } from "./middlewares/session.js";

const app = express();

// 啟用 CORS，允許前端 (http://localhost:5173) 帶 cookie
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://juany-studio.zeabur.app", // 前端正式網址
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
app.use("/api/news", news);
app.use("/api/categories", categories);
app.use("/api/subcategories", subcategories);
app.use("/api/cart", cart);
app.use("/api/discounts", discounts);
app.use("/api/addons", addons);
app.use("/api/tappay", tappay);
app.use("/api/articles", articles);
app.use("/api/article-categories", articleCategories);
app.use("/api/article-subcategories", articleSubcategories);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));
