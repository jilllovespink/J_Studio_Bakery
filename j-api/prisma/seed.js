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
      ingredients: "低筋麵粉、新鮮雞蛋、無鹽奶油、鮮奶油、天然香草莢、細砂糖",
      shelfLife: "常溫下1天，冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "以新鮮雞蛋與天然香草莢製作的香草奶油蛋糕，蛋糕體細緻綿密，搭配濃郁卻輕盈的鮮奶油，甜度適中，入口帶有淡淡香草芳香。整體層次柔和而優雅，無論日常聚會或慶祝場合都相當適合。",
      productvariant: {
        create: [
          { variantName: "8吋", price: 880, isDefault: true },
          { variantName: "12吋", price: 1280 },
        ],
      },
    },
  });

  // 草莓鮮奶油蛋糕
  await prisma.product.create({
    data: {
      name: "草莓鮮奶油蛋糕",
      slug: "strawberry-cream-cake",
      description: "當季草莓與輕盈鮮奶油，季節限定。",
      heroImage: "/images/products/strawberry.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subSignatureCream?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、新鮮雞蛋、鮮奶油、砂糖、當季草莓",
      shelfLife: "冷藏保存2天，冷凍保存5天",
      flavorProfile:
        "嚴選當季草莓搭配輕盈細緻的奶油，蛋糕體鬆軟濕潤，每一口都能感受到草莓的酸甜與奶香的柔和交織。甜度控制恰到好處，口感清爽不膩，是最受歡迎的季節限定款。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 980, isDefault: true },
          { variantName: "8吋", price: 1380 },
        ],
      },
    },
  });

  // 重乳酪蛋糕
  await prisma.product.create({
    data: {
      name: "重乳酪蛋糕",
      slug: "baked-cheesecake",
      description: "濃郁厚實，冷凍宅配風味不打折。",
      heroImage: "/images/products/cheesecake.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subChocolateCakes?.id ?? null,
      isHot: false,
      ingredients: "奶油乳酪、雞蛋、鮮奶油、砂糖、餅乾底",
      shelfLife: "冷藏保存3天，冷凍保存10天",
      flavorProfile:
        "使用進口奶油乳酪與鮮奶油製作，口感濃郁厚實，伴隨乳酪自然的微酸與奶香。餅乾底增添酥脆層次，冷藏時綿密滑順，冷凍後更像冰淇淋般的細膩風味，適合各種甜點愛好者。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 680, isDefault: true },
          { variantName: "8吋", price: 980 },
        ],
      },
    },
  });

  // 開心果覆盆子蛋糕
  await prisma.product.create({
    data: {
      name: "開心果覆盆子蛋糕",
      slug: "pistachio-raspberry-cake",
      description: "法式開心果搭配酸甜覆盆子，風味絕佳。",
      heroImage: "/images/products/pistachio.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subPistachioCakes?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、開心果粉、新鮮雞蛋、鮮奶油、覆盆子、砂糖",
      shelfLife: "冷藏保存2天，冷凍保存7天",
      flavorProfile:
        "以開心果粉製作的蛋糕體帶有堅果香氣，搭配新鮮覆盆子內餡，酸甜平衡。奶油層柔滑輕盈，讓堅果與莓果的風味互相襯托，呈現法式甜點的優雅層次。",
      productvariant: {
        create: [{ variantName: "6吋", price: 1080, isDefault: true }],
      },
    },
  });

  // 芋泥鮮奶蛋糕
  await prisma.product.create({
    data: {
      name: "芋泥鮮奶蛋糕",
      slug: "taro-cake",
      description: "綿密芋泥餡，香甜不膩。",
      heroImage: "/images/products/taro.jpg",
      categoryId: classicCakes.id,
      subcategoryId: subTaroCakes?.id ?? null,
      isHot: false,
      ingredients: "芋頭泥、低筋麵粉、鮮奶油、雞蛋、砂糖",
      shelfLife: "冷藏保存2天，冷凍保存5天",
      flavorProfile:
        "嚴選芋頭蒸煮打泥製成綿密內餡，香氣濃郁卻不顯厚重。蛋糕體柔軟，鮮奶油與芋泥的比例恰到好處，整體甜而不膩，帶來舒適自然的口感，是經典的人氣款。",
      productvariant: {
        create: [{ variantName: "8吋", price: 980, isDefault: true }],
      },
    },
  });

  // 軟心巧克力餅乾
  await prisma.product.create({
    data: {
      name: "軟心巧克力餅乾",
      slug: "soft-choco-cookie",
      description: "美式經典軟餅乾，濃郁巧克力。",
      heroImage: "/images/products/soft-cookie.jpg",
      categoryId: handmadeCookies.id,
      subcategoryId: subSoftCookies?.id ?? null,
      isHot: false,
      ingredients: "中筋麵粉、無鹽奶油、砂糖、雞蛋、黑巧克力豆",
      shelfLife: "常溫下3天，冷藏保存7天",
      flavorProfile:
        "美式經典軟餅乾，外層微酥、中心柔軟，混合大量黑巧克力豆，每一口都充滿濃郁可可風味。甜度偏濃，但配上牛奶或黑咖啡更能展現迷人的口感。",
      productvariant: {
        create: [{ variantName: "4入", price: 160, isDefault: true }],
      },
    },
  });

  // 可可豆曲奇
  await prisma.product.create({
    data: {
      name: "可可豆曲奇",
      slug: "cocoa-cookie",
      description: "入口即化，濃郁可可香。",
      heroImage: "/images/products/cookie.jpg",
      categoryId: handmadeCookies.id,
      subcategoryId: subHkCookies?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、可可粉、無鹽奶油、砂糖、雞蛋",
      shelfLife: "常溫下7天，冷藏保存14天",
      flavorProfile:
        "採用高純度可可粉製作，入口即化，帶有濃郁巧克力香氣。質地細緻，口感輕盈不膩，特別適合喜愛可可風味的甜點愛好者，是茶點與伴手禮的首選。",
      productvariant: {
        create: [
          { variantName: "小盒", price: 220, isDefault: true },
          { variantName: "大盒", price: 380 },
        ],
      },
    },
  });

  // 香草雪球餅乾
  await prisma.product.create({
    data: {
      name: "香草雪球餅乾",
      slug: "snowball-cookie",
      description: "酥鬆口感，甜而不膩。",
      heroImage: "/images/products/snowball.jpg",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、無鹽奶油、糖粉、香草粉",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "圓潤小巧的雪球餅乾，外層裹上細緻糖粉，入口即化，帶有淡淡的香草芳香。甜度溫和，口感酥鬆輕盈，是搭配茶飲或咖啡的理想小點心。",
      productvariant: {
        create: [{ variantName: "12入", price: 280, isDefault: true }],
      },
    },
  });

  // 仲夏芒果生乳捲
  await prisma.product.create({
    data: {
      name: "仲夏芒果生乳捲",
      slug: "mango-cream-roll",
      description: "當季芒果，香甜多汁。",
      heroImage: "/images/products/mango-roll.jpg",
      categoryId: chilledRolls.id,
      subcategoryId: subSeasonalRolls?.id ?? null,
      isHot: false,
      ingredients: "雞蛋、低筋麵粉、砂糖、鮮奶油、芒果",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "柔軟細膩的蛋糕體捲入當季芒果果肉與輕盈奶油，口感香甜多汁。芒果的熱帶果香與鮮奶油的細緻融合，清爽不膩，是夏季最受歡迎的限定款甜點。",
      productvariant: {
        create: [{ variantName: "1條", price: 480, isDefault: true }],
      },
    },
  });

  // 北海道生乳捲
  await prisma.product.create({
    data: {
      name: "北海道生乳捲",
      slug: "hokkaido-cream-roll",
      description: "嚴選北海道十勝生乳，柔滑口感。",
      heroImage: "/images/products/hokkaido-roll.jpg",
      categoryId: chilledRolls.id,
      subcategoryId: subHokkaidoRolls?.id ?? null,
      isHot: false,
      ingredients: "雞蛋、低筋麵粉、砂糖、北海道十勝鮮奶油",
      shelfLife: "冷藏保存3天",
      flavorProfile:
        "以北海道十勝生乳製作的鮮奶油，質地柔滑細緻，蛋糕體輕盈鬆軟，入口即化。奶香純淨自然，甜度清爽，是展現牛乳本味的經典款生乳捲。",
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
