import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  console.log("Deleting old data...");
  await prisma.orderItem?.deleteMany().catch(() => {});
  await prisma.order?.deleteMany().catch(() => {});
  await prisma.productVariant?.deleteMany().catch(() => {});
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.courseIntent?.deleteMany().catch(() => {});
  await prisma.course.deleteMany();
  await prisma.news.deleteMany();

  console.log("Creating products...");
  await prisma.product.create({
    data: {
      name: "香草奶油蛋糕",
      slug: "vanilla-butter-cake",
      category: "CHILLED",
      description: "手作香草奶油，口感綿密。",
      heroImage: "/images/products/vanilla.jpg",
      productvariant: {
        create: [
          { variantName: "8吋", price: 880, isDefault: true },
          { variantName: "12吋", price: 1280 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "可可豆曲奇",
      slug: "cocoa-cookie",
      category: "ROOM_TEMP",
      description: "入口即化，濃郁可可香。",
      heroImage: "/images/products/cookie.jpg",
      productvariant: {
        create: [
          { variantName: "小盒", price: 220, isDefault: true },
          { variantName: "大盒", price: 380 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "檸檬磅蛋糕",
      slug: "lemon-pound-cake",
      category: "ROOM_TEMP",
      description: "清爽檸檬香，濕潤扎實口感。",
      heroImage: "/images/products/lemon-pound.jpg",
      productvariant: {
        create: [
          { variantName: "單條", price: 320, isDefault: true },
          { variantName: "雙入禮盒", price: 600 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "草莓鮮奶油蛋糕",
      slug: "strawberry-cream-cake",
      category: "CHILLED",
      description: "當季草莓與輕盈鮮奶油，季節限定。",
      heroImage: "/images/products/strawberry.jpg",
      productvariant: {
        create: [
          { variantName: "6吋", price: 980, isDefault: true },
          { variantName: "8吋", price: 1380 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "重乳酪蛋糕",
      slug: "baked-cheesecake",
      category: "FROZEN",
      description: "濃郁厚實，冷凍宅配風味不打折。",
      heroImage: "/images/products/cheesecake.jpg",
      productvariant: {
        create: [
          { variantName: "6吋", price: 680, isDefault: true },
          { variantName: "8吋", price: 980 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "布朗尼禮盒",
      slug: "brownie-gift-box",
      category: "ROOM_TEMP",
      description: "微苦甜巧克力、酥軟口感，送禮自用皆宜。",
      heroImage: "/images/products/brownie.jpg",
      productvariant: {
        create: [
          { variantName: "6 入", price: 360, isDefault: true },
          { variantName: "12 入", price: 680 },
        ],
      },
    },
  });

  console.log("Creating article...");
  await prisma.article.create({
    data: {
      title: "居家打發的 3 個穩定技巧",
      slug: "whipping-tips",
      excerpt: "器具冷卻、糖分比例、打發程度判斷是關鍵…",
      content: "<p>詳細內容…</p>",
      publishedAt: new Date(),
    },
  });

  console.log("Creating course...");
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

  console.log("Creating news...");
  await prisma.news.createMany({
    data: [
      {
        title: "母親節蛋糕開始預購",
        content:
          "母親節即將來臨，為媽媽準備一份特別的驚喜吧！我們的限定蛋糕將於4月中開始預購，數量有限，敬請提前預定。",
        date: new Date("2024-04-15"),
        image: null,
      },
      {
        title: "情人節送禮首選生巧克力禮盒",
        content:
          "香濃手工生巧克力，最適合在2月與心愛的人分享。限量禮盒，2月初正式開賣！",
        date: new Date("2024-02-01"),
        image: null,
      },
      {
        title: "仲夏綠葡萄千層新上市！",
        content:
          "盛夏限定甜點—清爽的綠葡萄千層蛋糕，酸甜滋味絕對讓你難忘！3月起於全門市供應。",
        date: new Date("2024-03-01"),
        image: null,
      },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  });
