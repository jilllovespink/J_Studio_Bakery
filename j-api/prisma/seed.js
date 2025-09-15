import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 清空資料
  console.log("Deleting old data...");
  await prisma.orderItem?.deleteMany().catch(() => {});
  await prisma.order?.deleteMany().catch(() => {});
  await prisma.productVariant?.deleteMany().catch(() => {});
  await prisma.product.deleteMany();
  await prisma.product_subcategory.deleteMany();
  await prisma.product_category.deleteMany();
  await prisma.article.deleteMany();
  await prisma.courseIntent?.deleteMany().catch(() => {});
  await prisma.course.deleteMany();
  await prisma.news.deleteMany();

  // 建立大分類與子分類
  console.log("Creating categories & subcategories...");
  const classicCakes = await prisma.product_category.create({
    data: {
      name: "經典蛋糕",
      slug: "classic-cakes",
      description: "多種系列蛋糕，滿足您的味蕾需求。",
      orderIndex: 1,
      subcategories: {
        create: [
          {
            name: "招牌鮮奶油蛋糕",
            slug: "signature-cream-cakes",
            orderIndex: 1,
          },
          { name: "生巧克力蛋糕", slug: "chocolate-cakes", orderIndex: 2 },
          { name: "法式開心果蛋糕", slug: "pistachio-cakes", orderIndex: 3 },
          { name: "芋泥系列蛋糕", slug: "taro-cakes", orderIndex: 4 },
        ],
      },
    },
    include: { subcategories: true },
  });

  const handmadeCookies = await prisma.product_category.create({
    data: {
      name: "手工餅乾",
      slug: "cookies",
      description: "多款口味餅乾，香酥可口。",
      orderIndex: 2,
      subcategories: {
        create: [
          { name: "美式軟餅乾", slug: "soft-cookies", orderIndex: 1 },
          { name: "港式曲奇餅", slug: "hk-cookies", orderIndex: 2 },
          { name: "雪球餅乾", slug: "snowball-cookies", orderIndex: 3 },
        ],
      },
    },
    include: { subcategories: true },
  });

  const chilledRolls = await prisma.product_category.create({
    data: {
      name: "雪藏生乳捲",
      slug: "cream-rolls",
      description: "入口即化的生乳捲系列。",
      orderIndex: 3,
      subcategories: {
        create: [
          { name: "季節限定水果系列", slug: "seasonal-rolls", orderIndex: 1 },
          { name: "北海道十勝生乳系列", slug: "hokkaido-rolls", orderIndex: 2 },
        ],
      },
    },
    include: { subcategories: true },
  });

  // 取出子分類
  const subSignatureCream = classicCakes.subcategories.find(
    (s) => s.slug === "signature-cream-cakes"
  );
  const subChocolateCakes = classicCakes.subcategories.find(
    (s) => s.slug === "chocolate-cakes"
  );
  const subPistachioCakes = classicCakes.subcategories.find(
    (s) => s.slug === "pistachio-cakes"
  );
  const subTaroCakes = classicCakes.subcategories.find(
    (s) => s.slug === "taro-cakes"
  );

  const subSoftCookies = handmadeCookies.subcategories.find(
    (s) => s.slug === "soft-cookies"
  );
  const subHkCookies = handmadeCookies.subcategories.find(
    (s) => s.slug === "hk-cookies"
  );
  const subSnowballCookies = handmadeCookies.subcategories.find(
    (s) => s.slug === "snowball-cookies"
  );

  const subSeasonalRolls = chilledRolls.subcategories.find(
    (s) => s.slug === "seasonal-rolls"
  );
  const subHokkaidoRolls = chilledRolls.subcategories.find(
    (s) => s.slug === "hokkaido-rolls"
  );

  // 建立產品
  console.log("Creating products...");

  // 招牌鮮奶油蛋糕
  await prisma.product.create({
    data: {
      name: "香草奶油蛋糕",
      slug: "vanilla-butter-cake",
      description: "手作香草奶油，口感綿密。",
      heroImage: "/images/products/vanilla.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subSignatureCream?.id ?? null,
      isHot: true,
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
      name: "草莓鮮奶油蛋糕",
      slug: "strawberry-cream-cake",
      description: "當季草莓與輕盈鮮奶油，季節限定。",
      heroImage: "/images/products/strawberry.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subSignatureCream?.id ?? null,
      isHot: true,
      productvariant: {
        create: [
          { variantName: "6吋", price: 980, isDefault: true },
          { variantName: "8吋", price: 1380 },
        ],
      },
    },
  });

  // 生巧克力蛋糕
  await prisma.product.create({
    data: {
      name: "重乳酪蛋糕",
      slug: "baked-cheesecake",
      description: "濃郁厚實，冷凍宅配風味不打折。",
      heroImage: "/images/products/cheesecake.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subChocolateCakes?.id ?? null,
      isHot: false,
      productvariant: {
        create: [
          { variantName: "6吋", price: 680, isDefault: true },
          { variantName: "8吋", price: 980 },
        ],
      },
    },
  });

  // 法式開心果蛋糕
  await prisma.product.create({
    data: {
      name: "開心果覆盆子蛋糕",
      slug: "pistachio-raspberry-cake",
      description: "法式開心果搭配酸甜覆盆子，風味絕佳。",
      heroImage: "/images/products/pistachio.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subPistachioCakes?.id ?? null,
      isHot: false,
      productvariant: {
        create: [{ variantName: "6吋", price: 1080, isDefault: true }],
      },
    },
  });

  // 芋泥蛋糕
  await prisma.product.create({
    data: {
      name: "芋泥鮮奶蛋糕",
      slug: "taro-cake",
      description: "綿密芋泥餡，香甜不膩。",
      heroImage: "/images/products/taro.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subTaroCakes?.id ?? null,
      isHot: false,
      productvariant: {
        create: [{ variantName: "8吋", price: 980, isDefault: true }],
      },
    },
  });

  // 餅乾系列
  await prisma.product.create({
    data: {
      name: "軟心巧克力餅乾",
      slug: "soft-choco-cookie",
      description: "美式經典軟餅乾，濃郁巧克力。",
      heroImage: "/images/products/soft-cookie.jpg",
      categoryId: handmadeCookies.id,
      subcategoryId: subSoftCookies?.id ?? null,
      isHot: false,
      productvariant: {
        create: [{ variantName: "4入", price: 160, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "可可豆曲奇",
      slug: "cocoa-cookie",
      description: "入口即化，濃郁可可香。",
      heroImage: "/images/products/cookie.jpg",
      categoryId: handmadeCookies.id,
      subcategoryId: subHkCookies?.id ?? null,
      isHot: true,
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
      name: "香草雪球餅乾",
      slug: "snowball-cookie",
      description: "酥鬆口感，甜而不膩。",
      heroImage: "/images/products/snowball.jpg",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: false,
      productvariant: {
        create: [{ variantName: "12入", price: 280, isDefault: true }],
      },
    },
  });

  // 生乳捲系列
  await prisma.product.create({
    data: {
      name: "仲夏芒果生乳捲",
      slug: "mango-cream-roll",
      description: "當季芒果，香甜多汁。",
      heroImage: "/images/products/mango-roll.jpg",
      categoryId: chilledRolls.id,
      subcategoryId: subSeasonalRolls?.id ?? null,
      isHot: false,
      productvariant: {
        create: [{ variantName: "1條", price: 480, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "北海道生乳捲",
      slug: "hokkaido-cream-roll",
      description: "嚴選北海道十勝生乳，柔滑口感。",
      heroImage: "/images/products/hokkaido-roll.jpg",
      categoryId: chilledRolls.id,
      subcategoryId: subHokkaidoRolls?.id ?? null,
      isHot: false,
      productvariant: {
        create: [{ variantName: "1條", price: 520, isDefault: true }],
      },
    },
  });

  // 文章
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

  // 課程
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

  // 最新消息
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
