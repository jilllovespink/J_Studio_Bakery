import { prisma } from "./prisma.js";

app.get("/test-db", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products); // 空陣列 [] 也代表連線成功
});
