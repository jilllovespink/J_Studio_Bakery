import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 清空舊資料
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.courseIntent.deleteMany();
  await prisma.course.deleteMany();

  // 商品 1：香草奶油蛋糕（冷藏）
  await prisma.product.create({
    data: {
      name: "香草奶油蛋糕",
      slug: "vanilla-butter-cake",
      category: "CHILLED",
      description: "手作香草奶油，口感綿密。",
      heroImage: "/images/products/vanilla.jpg",
      variants: {
        create: [
          { variantName: "8吋", price: 880, isDefault: true },
          { variantName: "12吋", price: 1280 },
        ],
      },
    },
  });

  // 商品 2：可可豆曲奇（常溫）
  await prisma.product.create({
    data: {
      name: "可可豆曲奇",
      slug: "cocoa-cookie",
      category: "ROOM_TEMP",
      description: "入口即化，濃郁可可香。",
      heroImage: "/images/products/cookie.jpg",
      variants: {
        create: [
          { variantName: "小盒", price: 220, isDefault: true },
          { variantName: "大盒", price: 380 },
        ],
      },
    },
  });

  // 商品 3：檸檬磅蛋糕（常溫）
  await prisma.product.create({
    data: {
      name: "檸檬磅蛋糕",
      slug: "lemon-pound-cake",
      category: "ROOM_TEMP",
      description: "清爽檸檬香，濕潤扎實口感。",
      heroImage: "/images/products/lemon-pound.jpg",
      variants: {
        create: [
          { variantName: "單條", price: 320, isDefault: true },
          { variantName: "雙入禮盒", price: 600 },
        ],
      },
    },
  });

  // 商品 4：草莓鮮奶油蛋糕（冷藏/季節）
  await prisma.product.create({
    data: {
      name: "草莓鮮奶油蛋糕",
      slug: "strawberry-cream-cake",
      category: "CHILLED",
      description: "當季草莓與輕盈鮮奶油，季節限定。",
      heroImage: "/images/products/strawberry.jpg",
      variants: {
        create: [
          { variantName: "6吋", price: 980, isDefault: true },
          { variantName: "8吋", price: 1380 },
        ],
      },
    },
  });

  // 商品 5：重乳酪蛋糕（冷凍）
  await prisma.product.create({
    data: {
      name: "重乳酪蛋糕",
      slug: "baked-cheesecake",
      category: "FROZEN",
      description: "濃郁厚實，冷凍宅配風味不打折。",
      heroImage: "/images/products/cheesecake.jpg",
      variants: {
        create: [
          { variantName: "6吋", price: 680, isDefault: true },
          { variantName: "8吋", price: 980 },
        ],
      },
    },
  });

  // 商品 6：布朗尼禮盒（常溫）
  await prisma.product.create({
    data: {
      name: "布朗尼禮盒",
      slug: "brownie-gift-box",
      category: "ROOM_TEMP",
      description: "微苦甜巧克力、酥軟口感，送禮自用皆宜。",
      heroImage: "/images/products/brownie.jpg",
      variants: {
        create: [
          { variantName: "6 入", price: 360, isDefault: true },
          { variantName: "12 入", price: 680 },
        ],
      },
    },
  });

  // 文章（展示用）
  await prisma.article.create({
    data: {
      title: "居家打發的 3 個穩定技巧",
      slug: "whipping-tips",
      excerpt: "器具冷卻、糖分比例、打發程度判斷是關鍵…",
      content: "<p>詳細內容…</p>",
      publishedAt: new Date(),
    },
  });

  // 課程（展示 + 之後的意向表單）
  await prisma.course.create({
    data: {
      title: "莓果鮮奶油蛋糕｜小班體驗",
      slug: "berry-cream-cake-class",
      description: "16 人小班，娟姊親授。",
      coverImage: "/images/courses/berry.jpg",
      price: 1500,
      startAt: new Date(Date.now() + 14 * 86400 * 1000),
      durationMinutes: 150,
    },
  });

  console.log("Seed done ✓");
}

main().finally(() => prisma.$disconnect());
