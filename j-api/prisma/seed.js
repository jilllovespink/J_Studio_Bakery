import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 清空資料
  console.log("Deleting old data...");
  await prisma.orderItem?.deleteMany().catch(() => {});
  await prisma.order?.deleteMany().catch(() => {});
  await prisma.banners?.deleteMany().catch(() => {});
  await prisma.productVariant?.deleteMany().catch(() => {});
  await prisma.product.deleteMany();
  await prisma.product_subcategory.deleteMany();
  await prisma.product_category.deleteMany();
  await prisma.article.deleteMany();
  await prisma.courseIntent?.deleteMany().catch(() => {});
  await prisma.course.deleteMany();
  await prisma.news.deleteMany();
  await prisma.articleSubCategory?.deleteMany().catch(() => {});
  await prisma.articleCategory?.deleteMany().catch(() => {});
  await prisma.discount_code.deleteMany();

  // 建立文章大分類與子分類
  console.log("Creating article categories & subcategories...");
  const juansRecipes = await prisma.articleCategory.create({
    data: {
      name: "娟姐獨家食譜",
      slug: "juans-recipes",
      orderIndex: 1,
      subcategories: {
        create: [
          { name: "蛋糕食譜", slug: "cake-recipes", orderIndex: 1 },
          { name: "餅乾食譜", slug: "cookie-recipes", orderIndex: 2 },
          { name: "鹹點食譜", slug: "savory-recipes", orderIndex: 3 },
        ],
      },
    },
    include: { subcategories: true },
  });

  const bakingSkills = await prisma.articleCategory.create({
    data: {
      name: "烘焙實作技巧",
      slug: "baking-skills",
      orderIndex: 2,
      subcategories: {
        create: [
          { name: "蛋糕造型技巧", slug: "cake-decoration", orderIndex: 1 },
          { name: "餅乾塑形技巧", slug: "cookie-shaping", orderIndex: 2 },
          { name: "調味技巧", slug: "flavoring-skills", orderIndex: 3 },
        ],
      },
    },
    include: { subcategories: true },
  });

  const ingredientsCompare = await prisma.articleCategory.create({
    data: {
      name: "食材挑選技巧",
      slug: "ingredients-compare",
      orderIndex: 3,
      subcategories: {
        create: [
          { name: "食材挑選", slug: "ingredient-selection", orderIndex: 1 },
          { name: "食材保存", slug: "ingredient-storage", orderIndex: 2 },
        ],
      },
    },
    include: { subcategories: true },
  });

  const bakingTools = await prisma.articleCategory.create({
    data: {
      name: "烘焙器材選擇",
      slug: "baking-tools",
      orderIndex: 4,
      subcategories: {
        create: [
          { name: "烘焙電器挑選", slug: "appliance-selection", orderIndex: 1 },
          { name: "計量器具挑選", slug: "measuring-tools", orderIndex: 2 },
          { name: "包裝材料挑選", slug: "packaging-selection", orderIndex: 3 },
        ],
      },
    },
    include: { subcategories: true },
  });

  // 取出子分類
  const subCakeRecipes = juansRecipes.subcategories.find(
    (s) => s.slug === "cake-recipes"
  );
  const subCookieRecipes = juansRecipes.subcategories.find(
    (s) => s.slug === "cookie-recipes"
  );
  const subSavoryRecipes = juansRecipes.subcategories.find(
    (s) => s.slug === "savory-recipes"
  );

  const subCakeDecoration = bakingSkills.subcategories.find(
    (s) => s.slug === "cake-decoration"
  );
  const subCookieShaping = bakingSkills.subcategories.find(
    (s) => s.slug === "cookie-shaping"
  );
  const subFlavoringSkills = bakingSkills.subcategories.find(
    (s) => s.slug === "flavoring-skills"
  );

  const subIngredientSelection = ingredientsCompare.subcategories.find(
    (s) => s.slug === "ingredient-selection"
  );
  const subIngredientStorage = ingredientsCompare.subcategories.find(
    (s) => s.slug === "ingredient-storage"
  );

  const subApplianceSelection = bakingTools.subcategories.find(
    (s) => s.slug === "appliance-selection"
  );
  const subMeasuringTools = bakingTools.subcategories.find(
    (s) => s.slug === "measuring-tools"
  );
  const subPackagingSelection = bakingTools.subcategories.find(
    (s) => s.slug === "packaging-selection"
  );

  // 建立文章
  console.log("Creating articles...");
  await prisma.article.createMany({
    data: [
      {
        title: "新手也能成功！戚風蛋糕的黃金比例與烘焙秘訣",
        slug: "chiffon-cake-recipe",
        excerpt: "掌握黃金比例與技巧，新手也能成功烤出完美戚風蛋糕！",
        content: `
      <h2>戚風蛋糕的黃金比例</h2>
      <p>
      戚風蛋糕一直是許多烘焙愛好者心中的夢幻甜點。它的口感輕盈、蓬鬆又帶有彈性，看似簡單卻常常讓新手困惑。其實，掌握「黃金比例」是成功的關鍵。所謂的黃金比例，指的是雞蛋、低筋麵粉、植物油、砂糖與液體（水或牛奶）的平衡。一般來說，雞蛋與液體的比例應該保持在 1:1.2 左右，才能兼顧濕潤與支撐；油脂則不能過多，否則蛋糕容易塌陷。砂糖的比例若太低，打發不穩定；若太高，又會使蛋糕口感過於黏重。因此，遵循正確的比例，就能在初學階段大幅提升成功率。
      </p>

      <h3>雞蛋的打發是靈魂</h3>
      <p>
      戚風蛋糕的結構主要依賴蛋白打發所形成的氣泡網狀結構。打發的程度需達到「濕性發泡」到「硬性發泡」之間，也就是提起打蛋器時，蛋白尖端能立起但略微彎曲。若打發不足，蛋糕容易塌陷；過度打發，則會導致組織粗糙甚至出現大氣孔。新手常見的錯誤是急於完成，導致打發不均，這時建議分次加糖，並保持中速打發，能更容易掌握穩定的蛋白霜。
      </p>

      <h3>拌合方式的拿捏</h3>
      <p>
      拌合蛋白與蛋黃麵糊時，要遵循「由下往上翻拌」的原則，避免畫圈攪拌造成氣泡消失。許多人為了節省時間而快速攪拌，結果氣泡破壞過多，出爐後蛋糕不僅矮小還會出現收縮。建議使用矽膠刮刀，從碗底將麵糊翻起，再輕輕壓下，慢慢混合均勻。此步驟雖然看似耗時，但卻是確保蛋糕蓬鬆口感的關鍵。
      </p>

      <h2>新手常見失敗原因與解決方法</h2>
      <p>
      戚風蛋糕失敗的原因其實很容易被歸納，最常見的包括打發不穩定、比例錯誤、烘烤溫度不正確，以及脫模技巧不足。若能針對這些環節逐一改善，即使是新手也能成功烘焙出漂亮的成品。
      </p>

      <h3>烘烤溫度與時間控制</h3>
      <p>
      一般建議將烤箱預熱至 170 度，再以上下火烘烤約 35 至 40 分鐘。溫度過高會造成表面過早定型，內部卻未完全熟透；溫度過低則導致整體結構無法撐起。建議使用烤箱溫度計，因為許多家用烤箱的實際溫度與面板顯示會有落差。當蛋糕表面上色均勻、插入竹籤後無濕黏麵糊，即表示可以出爐。
      </p>

      <h3>脫模與冷卻技巧</h3>
      <p>
      戚風蛋糕出爐後必須立刻倒扣，利用重力避免收縮塌陷。若未倒扣，蛋糕在冷卻時容易因為結構不穩定而塌陷，影響口感與外觀。冷卻完全後再用脫模刀沿著模具邊緣輕輕劃開，即可取出完整的蛋糕。建議初學者一開始使用不沾烤模，但要避免塗油，否則蛋糕爬升不順利，也容易掉落失敗。
      </p>

      <p>
      總結來說，戚風蛋糕看似複雜，其實只要抓住「黃金比例」、控制蛋白打發、注意拌合手法、維持正確溫度與脫模技巧，就能大幅提升成功率。只要多練習幾次，新手也能成功做出鬆軟綿密的戚風蛋糕，為餐桌增添一份幸福的甜蜜。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-felicity-tai-7965927.jpg?alt=media&token=31b466f8-feae-46c4-bdd4-1381c6536b1d",
        publishedAt: new Date(),
        categoryId: juansRecipes.id,
        subCategoryId: subCakeRecipes.id,
      },
      {
        title: "手工餅乾完整指南：鬆脆、軟Q一次學會",
        slug: "handmade-cookie-guide",
        excerpt: "從比例、材料到技巧，帶你一次掌握鬆脆與軟Q手工餅乾秘訣！",
        content: `
      <h2>認識手工餅乾的基本元素</h2>
      <p>
      手工餅乾看似簡單，但想要掌握「鬆脆」與「軟Q」的口感，其實和材料比例、製作手法密不可分。基本元素包含麵粉、油脂、糖、蛋與調味。不同的組合與處理方式，決定了餅乾的風味與口感。例如，使用低筋麵粉會讓餅乾更加鬆軟；而使用高筋麵粉則會增加嚼勁。糖的種類也會造成差異，白糖讓餅乾乾脆，黑糖或蜂蜜則增加濕潤感與香氣。
      </p>

      <h3>油脂的選擇與影響</h3>
      <p>
      奶油是手工餅乾最常見的油脂來源，它能提供香氣並塑造酥脆感。若使用植物油，餅乾口感會較軟，少了一些奶油特有的層次。固態奶油與液態油的比例，也直接影響到餅乾的穩定性與香氣。新手建議從奶油開始嘗試，因為它的特性較容易掌握，並且在打發過程中能帶入空氣，使餅乾組織更輕盈。
      </p>

      <h3>糖與雞蛋的黃金比例</h3>
      <p>
      餅乾配方中，糖不只是調味，它同時影響組織與外觀。糖量越高，餅乾在烘烤時會更容易擴展變薄，口感也更脆。若糖量偏低，則會有較厚實與軟Q的口感。雞蛋則提供結構與濕潤度，全蛋能平衡風味；若只使用蛋黃，餅乾更濃郁；若以蛋白為主，餅乾則更輕盈爽口。掌握比例的關鍵，在於依照自己喜歡的口感去調整。
      </p>

      <h2>烘焙技巧與常見問題</h2>
      <p>
      材料準備好之後，製作過程的細節才是決定成敗的關鍵。攪拌方法、冷藏時間與烘烤溫度，都是左右口感的重要因素。許多新手會因為急於完成而忽略這些小細節，結果餅乾不是過硬、就是過軟。
      </p>

      <h3>攪拌與麵糰處理</h3>
      <p>
      攪拌餅乾麵糰時，最重要的是「不要過度攪拌」。若麵糰出筋，餅乾會變得又硬又韌。建議使用切拌或低速混合的方式，僅需讓材料均勻即可。部分配方會建議將麵糰冷藏 30 分鐘至 1 小時，這樣能讓油脂回硬，烤出來的餅乾形狀更漂亮，也能避免過度延展。
      </p>

      <h3>烘烤溫度與時間控制</h3>
      <p>
      鬆脆型餅乾建議使用 180 度上下火烘烤 12 至 15 分鐘，表面金黃即可。若想要軟Q口感，則可以降低溫度至 160 度，延長時間至 18 至 20 分鐘，保持中心濕潤。新手建議先做少量測試，依照烤箱特性調整溫度與時間，才能找到最理想的結果。
      </p>

      <p>
      總結來說，手工餅乾的魅力就在於多樣性。透過調整麵粉、糖、油脂與雞蛋比例，以及掌握攪拌與烘烤技巧，你可以自由創造不同口感的餅乾。不論是鬆脆爽口，還是軟Q濕潤，都能在同一份指南中找到方向。只要多加練習，你也能輕鬆烤出屬於自己風格的完美手工餅乾。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-noellegracephotos-906054.jpg?alt=media&token=d923a6ec-21e8-451e-a16e-4864c77c9d31",
        publishedAt: new Date(),
        categoryId: juansRecipes.id,
        subCategoryId: subCookieRecipes.id,
      },
      {
        title: "下午茶必備！三款簡單又美味的鹹派做法",
        slug: "savory-pie-recipes",
        excerpt: "三款經典鹹派食譜，輕鬆完成下午茶的美味亮點！",
        content: `
      <h2>鹹派的魅力與基本元素</h2>
      <p>
      鹹派（Quiche）源自法國，是一道兼具飽足感與精緻外觀的料理，常見於早午餐、下午茶或聚會餐桌。它的特色在於「派皮 + 餡料 + 蛋奶液」的組合，外層酥脆，內餡濃郁。派皮通常使用低筋麵粉、奶油與少許水揉合而成，經過預烤後能保持脆口。餡料則可隨喜好變化，例如培根、蔬菜、起司或海鮮。最後加入蛋奶液烘烤，使整體結構滑順又帶有濃郁香氣。
      </p>

      <h3>派皮製作的關鍵</h3>
      <p>
      要做出理想的派皮，奶油必須保持低溫並快速切入麵粉，形成鬆散顆粒狀。避免過度揉捏，否則派皮容易變硬。將派皮冷藏 30 分鐘後，再進烤箱進行「盲烤」，也就是先鋪上烘焙紙與壓重石，讓派皮定型後再填餡，這樣能避免烤好後底部過濕。
      </p>

      <h3>蛋奶液比例</h3>
      <p>
      蛋奶液通常由雞蛋、鮮奶油或鮮奶組成。經典比例為「1 顆蛋 + 60 毫升鮮奶油」，能保持綿密的口感。若想減少油膩感，可以將鮮奶油部分替換成鮮奶。鹽、胡椒與肉豆蔻則是常見調味料，能提升整體香氣。
      </p>

      <h2>三款經典鹹派食譜</h2>
      <p>
      以下介紹三款簡單又美味的鹹派作法，新手也能快速上手，不論是朋友聚會還是個人下午茶，都能成為亮點。
      </p>

      <h3>培根起司鹹派</h3>
      <p>
      培根先煎至微焦後與洋蔥一同炒香，放入派皮底部，撒上大量起司，再倒入蛋奶液。以 180 度烘烤 25 分鐘，表面呈金黃色即可。這款鹹派香氣濃郁，鹹香的培根搭配起司，令人一口接一口。
      </p>

      <h3>菠菜鮭魚鹹派</h3>
      <p>
      將菠菜汆燙去澀水，鮭魚切塊稍微煎香，與派皮一同排列，倒入蛋奶液後加入少許檸檬皮屑，增加清爽感。烘烤約 30 分鐘後，口感濕潤且富含營養，非常適合喜歡清新風味的人。
      </p>

      <h3>蕃茄馬茲瑞拉鹹派</h3>
      <p>
      小蕃茄切半，與新鮮羅勒葉與馬茲瑞拉起司一同鋪在派皮上，加入蛋奶液後烘烤。烤好後酸甜的蕃茄與濃郁起司完美融合，散發義式風情，特別適合搭配沙拉與冷飲。
      </p>

      <p>
      總結來說，鹹派的自由度很高，只要掌握派皮、餡料與蛋奶液的基本原則，就能創造出無限可能。無論是經典的培根起司、清爽的菠菜鮭魚，或是充滿地中海風情的蕃茄馬茲瑞拉，都能讓你的下午茶更加豐富又滿足。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-amanda-reed-88238-288264.jpg?alt=media&token=df14b0be-c887-4ed9-ae6c-3c52dc91004b",
        publishedAt: new Date(),
        categoryId: juansRecipes.id,
        subCategoryId: subSavoryRecipes.id,
      },

      {
        title: "蛋糕裝飾新手必看：簡單技巧打造專業級外觀",
        slug: "cake-decoration-tips",
        excerpt: "掌握基礎裝飾技巧，新手也能做出專業感十足的蛋糕！",
        content: `
      <h2>蛋糕裝飾的基礎準備</h2>
      <p>
      許多人在完成蛋糕體後，最困惑的就是「如何讓蛋糕看起來專業又精緻」。其實，蛋糕裝飾並不一定需要昂貴的工具或複雜的技巧，只要掌握幾個基礎原則，新手也能打造令人驚艷的成品。首先要注意的就是「平整度」，蛋糕若表面凹凸不平，即使使用再漂亮的裝飾，也難以呈現專業感。因此，修整與抹面是裝飾的第一步。
      </p>

      <h3>修整與抹面技巧</h3>
      <p>
      蛋糕出爐後須完全冷卻，再用鋸齒刀修平表面與側邊，這樣能避免裝飾時傾斜。抹面時，建議先進行「薄抹層」（crumb coat），也就是先上一層薄薄的奶油霜，鎖住碎屑，再冷藏 10 分鐘後進行正式抹面。這樣能讓蛋糕外觀平整光滑，是專業感的重要基礎。
      </p>

      <h3>選擇適合的工具</h3>
      <p>
      基本裝飾工具包含抹刀、轉台與擠花袋。抹刀能幫助抹面平整，轉台則讓操作更順暢。新手可先準備一兩個花嘴，例如星形與圓形，就能做出多種花樣。隨著熟練度提升，再逐步擴充工具，避免一次投入過多反而增加挫折感。
      </p>

      <h2>常見裝飾風格與應用</h2>
      <p>
      當蛋糕表面處理完成後，就能開始進行創意裝飾。常見的裝飾風格包含奶油霜花邊、水果點綴、淋面與糖珠。不同的裝飾方式能帶來截然不同的視覺效果，搭配場合選擇合適風格，就能輕鬆提升蛋糕質感。
      </p>

      <h3>奶油霜與水果的搭配</h3>
      <p>
      奶油霜是最經典的裝飾素材，可以擠花、抹面或做漸層效果。若擔心過於甜膩，可以搭配新鮮水果，例如草莓、藍莓或奇異果，不僅增加色彩層次，也能平衡口感。建議選擇色彩鮮明、耐放的水果，避免水分過多影響蛋糕結構。
      </p>

      <h3>淋面與點綴技巧</h3>
      <p>
      巧克力淋面是近期非常流行的風格，只需將融化巧克力或甘納許倒在蛋糕上，讓它自然流下，就能製造出優雅效果。再搭配少許金箔、糖珠或餅乾碎，就能營造出高級感。新手也可以利用簡單的篩糖粉或可可粉，在蛋糕上創造圖案，輕鬆又實用。
      </p>

      <p>
      總結來說，蛋糕裝飾的重點不在於華麗，而在於細節與平整度。只要掌握修整與抹面的基礎，選擇合適的工具與簡單的裝飾手法，新手也能做出專業級外觀。隨著經驗累積，再慢慢加入創意元素，就能讓每一個蛋糕都充滿獨特風格。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-anete-lusina-18613267.jpg?alt=media&token=3804c06e-81ba-45f1-8537-8e684a97b69d",
        publishedAt: new Date(),
        categoryId: bakingSkills.id,
        subCategoryId: subCakeDecoration.id,
      },
      {
        title: "餅乾不再走樣！掌握完美塑形的關鍵小技巧",
        slug: "cookie-shaping-tips",
        excerpt: "學會塑形關鍵技巧，讓手工餅乾不再走樣，外觀精緻更誘人！",
        content: `
      <h2>餅乾塑形常見問題</h2>
      <p>
      許多新手在製作餅乾時，常常遇到「形狀烤完就走樣」的困擾。明明切得方正或壓模漂亮，結果出爐卻攤成一片。其實，餅乾走樣的原因大多來自麵糰狀態不正確、油脂與糖比例不當、或是塑形與冷藏步驟不足。了解這些問題，就能針對性地改善，讓餅乾保持理想造型。
      </p>

      <h3>油脂與糖比例</h3>
      <p>
      油脂若過多，烘烤時容易融化流出，導致餅乾攤平；糖量過高，會在高溫下快速融化，也造成形狀失控。因此，建議依循配方比例，不要隨意增減。若想降低甜度，可以減少部分糖量，但需同時調整其他成分，避免破壞平衡。
      </p>

      <h3>麵糰溫度的重要性</h3>
      <p>
      麵糰過軟是餅乾變形的主要原因之一。塑形後若沒有經過冷藏，烤箱高溫會迅速讓油脂融化，形狀就會崩塌。建議在切模或整形成型後，將麵糰放入冰箱冷藏 30 分鐘以上，甚至可以冷凍 10 分鐘，讓餅乾保持穩定結構。
      </p>

      <h2>掌握塑形的正確技巧</h2>
      <p>
      除了材料比例與溫度，塑形手法與工具選擇也會影響餅乾的外觀。無論是手搓圓球、切片，還是使用模型，都需要注意細節，才能避免烘烤後走樣。
      </p>

      <h3>正確的整形方法</h3>
      <p>
      若要做圓形餅乾，可以將麵糰先捲成長條狀，再冷藏至硬度適中後切片。這樣切出的圓片更均勻，也不易變形。若要使用模型壓模，記得在麵糰上灑少許低筋麵粉，避免沾黏，並確保麵糰厚度一致，出爐後才能維持漂亮輪廓。
      </p>

      <h3>工具的選擇</h3>
      <p>
      烤盤的材質與墊紙也會影響餅乾定型。深色烤盤導熱快，餅乾底部容易過焦，建議選用淺色或厚實的烤盤。使用矽膠烤墊能幫助餅乾均勻受熱，也能避免沾黏，對新手來說特別友善。此外，若要長時間保持麵糰形狀，冰格或圓筒模具都是好幫手。
      </p>

      <p>
      總結來說，想要避免餅乾走樣，必須同時兼顧「比例正確」、「溫度控制」與「塑形技巧」。只要在烘焙前多花一點心思，掌握冷藏、整形與工具應用，就能做出外觀漂亮、口感誘人的餅乾。從今天起，你的手工餅乾不僅好吃，還能好看！
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-pavel-danilyuk-6996299.jpg?alt=media&token=6431a5c2-eed6-4dd1-9728-cb0f2e2d45cf",
        publishedAt: new Date(),
        categoryId: bakingSkills.id,
        subCategoryId: subCookieShaping.id,
      },
      {
        title: "烘焙調味全攻略：如何用香料提升蛋糕與餅乾風味",
        slug: "baking-flavoring-guide",
        excerpt: "掌握香料運用，讓蛋糕與餅乾風味更有層次！",
        content: `
      <h2>香料在烘焙中的角色</h2>
      <p>
      在許多經典的蛋糕與餅乾配方中，香料往往扮演「靈魂」的角色。它們能夠強化風味、增添層次，甚至改變一款甜點的風格。常見的烘焙香料包含肉桂、肉豆蔻、丁香、薑粉與香草。雖然用量通常不多，但正確的比例能讓成品更加誘人。反之，如果過量，則容易掩蓋其他食材的細緻風味。因此，學會靈活運用香料，能夠大幅提升甜點質感。
      </p>

      <h3>常見經典香料</h3>
      <p>
      肉桂是餅乾與麵包的經典選擇，能帶來溫暖的香氣；肉豆蔻則適合搭配奶油與牛奶基底的甜點，使口感更濃郁。丁香香氣強烈，只需少量即可增添異國風味；薑粉常用於節慶餅乾，帶來微辣與暖身效果。香草則幾乎是烘焙必備，無論是香草精還是香草籽，都能提升甜點整體層次。
      </p>

      <h3>香料搭配的原則</h3>
      <p>
      不同香料之間有互補效果。例如，肉桂與肉豆蔻搭配能使蛋糕香氣更圓潤；薑粉與丁香結合則適合濃厚的黑糖或蜜糖基底。若是清爽的水果蛋糕，則建議以少量香草或檸檬皮屑點綴，避免味道過重。新手在嘗試時，可以先選擇單一香料，再逐步嘗試混搭，找到最適合的比例。
      </p>

      <h2>如何在蛋糕與餅乾中應用香料</h2>
      <p>
      香料的加入時機也會影響效果。若與糖一起打發，能釋放香氣並均勻融入；若與麵粉混合，則能在烘烤時穩定釋放香味。掌握添加時機，就能更好地控制最終成品的香氣強度。
      </p>

      <h3>在蛋糕中的應用</h3>
      <p>
      海綿蛋糕或戚風蛋糕可以加入少量肉桂或香草，帶來柔和香氣；磅蛋糕則適合搭配肉豆蔻與檸檬皮屑，增添厚實感與清新感。若製作巧克力蛋糕，可以加入一點辣椒粉或薑粉，創造意想不到的風味層次。
      </p>

      <h3>在餅乾中的應用</h3>
      <p>
      經典的肉桂餅乾（snickerdoodle）就是最佳示範，肉桂與糖結合能讓表面酥香迷人。薑餅則是聖誕必備，以薑粉、肉桂與丁香帶來節慶氣氛。巧克力餅乾中若加入少許海鹽與香草，更能凸顯可可風味。這些香料不僅能增加風味，還能賦予餅乾更鮮明的個性。
      </p>

      <p>
      總結來說，香料是烘焙中最能展現創意的元素之一。只要掌握比例與搭配原則，就能輕鬆讓蛋糕與餅乾的風味更加多元。從今天起，不妨試著在你的配方中加入一點香料，為甜點增添驚喜吧！
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-june-149994-1735095.jpg?alt=media&token=6032c42d-9fa2-4447-bf84-7d9ef04932e6",
        publishedAt: new Date(),
        categoryId: bakingSkills.id,
        subCategoryId: subFlavoringSkills.id,
      },

      {
        title: "烘焙食材挑選指南：麵粉、奶油、巧克力怎麼選才對？",
        slug: "ingredient-selection-guide",
        excerpt: "掌握食材挑選原則，讓烘焙作品更穩定、更美味！",
        content: `
      <h2>麵粉的挑選</h2>
      <p>
      麵粉是所有烘焙食譜中的靈魂材料，不同筋度的麵粉會帶來完全不同的口感與結構。一般來說，高筋麵粉含有較多麩質，適合用於麵包；中筋麵粉則多用於中式點心或麵條；低筋麵粉因為筋度低，特別適合用於蛋糕與餅乾，能帶來鬆軟口感。若想要做出更細緻的蛋糕，可以選擇專門的蛋糕粉。購買時要注意保存期限，避免因受潮而影響成品。
      </p>

      <h3>如何選擇適合的麵粉</h3>
      <p>
      烘焙新手常常搞不清楚該用哪一種麵粉。簡單來說：想要「鬆軟」就選低筋；想要「嚼勁」就選高筋；需要「多用途」則選中筋。建議依照食譜標示操作，避免因筋度不同導致失敗。另外，也可以嘗試不同品牌的麵粉，找到最適合自己習慣的口感。
      </p>

      <h3>保存方法</h3>
      <p>
      麵粉開封後建議存放在密封罐或冷藏，避免受潮與蟲害。特別是台灣氣候潮濕，若保存不當容易結塊或發霉，會直接影響烘焙品質。
      </p>

      <h2>奶油與巧克力的選擇</h2>
      <p>
      奶油與巧克力是許多甜點的風味來源。奶油除了提供香氣，也影響成品口感；巧克力則能帶來濃郁的可可層次。選擇這兩種食材時，品質往往決定成敗。
      </p>

      <h3>奶油的挑選</h3>
      <p>
      奶油可分為「動物性奶油」與「植物性奶油」。動物性奶油（例如無鹽奶油）風味濃郁、口感自然，適合高品質甜點；植物性奶油則成本低、穩定度高，但香氣不如動物性。若是新手建議使用無鹽動物性奶油，能更靈活掌控甜點鹹甜度。烘焙專業人士更傾向選擇歐洲進口奶油，因為奶香更為濃厚。
      </p>

      <h3>巧克力的挑選</h3>
      <p>
      烘焙用巧克力依照可可固形物含量區分為黑巧克力、牛奶巧克力與白巧克力。黑巧克力（70%以上可可）適合製作風味濃郁的布朗尼與蛋糕；牛奶巧克力口感偏甜，適合搭配餅乾或夾餡；白巧克力則不含可可粉，常用於裝飾或搭配酸味水果。購買時要選擇「烘焙專用」巧克力磚或豆，避免一般零食巧克力，因為其中含有額外油脂與添加物，會影響融化與調溫效果。
      </p>

      <p>
      總結來說，烘焙食材的挑選並不困難，只要掌握「麵粉看筋度、奶油看來源、巧克力看純度」三大原則，就能大幅提升作品品質。適合的食材搭配正確的技巧，才能讓你的蛋糕與餅乾更加美味可口。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-monserratsoldu-3821252.jpg?alt=media&token=07f73e01-fe73-43ad-8a38-06a7efc0d028",
        publishedAt: new Date(),
        categoryId: ingredientsCompare.id,
        subCategoryId: subIngredientSelection.id,
      },
      {
        title: "烘焙食材保存方法：延長新鮮度的專業祕訣",
        slug: "ingredient-storage-tips",
        excerpt: "掌握正確保存方法，讓烘焙食材保持最佳狀態更耐放！",
        content: `
      <h2>常見烘焙食材的保存重點</h2>
      <p>
      烘焙作品能否成功，除了技術之外，食材的新鮮度也扮演關鍵角色。麵粉、奶油、巧克力、堅果與香料若保存不當，不僅影響風味，還可能導致變質甚至危害健康。了解如何正確保存這些常見食材，能大幅延長使用期限，並確保每一次烘焙都能呈現最佳品質。
      </p>

      <h3>麵粉與糖類的保存</h3>
      <p>
      麵粉容易受潮與生蟲，建議開封後放入密封罐，並置於陰涼乾燥處。如果家中濕度高，可以放進冰箱冷藏，避免結塊與變質。糖類如砂糖、黑糖，則應避免受潮結硬，最好放在乾燥環境並加上密封蓋。黑糖較容易受潮，建議使用小包裝，減少開封後的保存壓力。
      </p>

      <h3>奶油與乳製品</h3>
      <p>
      奶油必須冷藏保存，且要避免長時間暴露在室溫中。若購買大量奶油，可以分裝冷凍，使用前再移至冷藏解凍。鮮奶油與牛奶則應遵守保存期限，並保持低溫存放，一旦開封最好在三到五天內使用完畢，以免風味下降或變酸。
      </p>

      <h2>巧克力、堅果與香料的保存</h2>
      <p>
      這些材料通常價格較高，若保存不當不僅浪費，更會影響甜點品質。正確的保存方法能讓它們保持香氣與口感，延長使用期限。
      </p>

      <h3>巧克力的保存</h3>
      <p>
      巧克力容易受熱產生「返白」現象，也就是表面出現白色斑點，雖然不影響食用安全，但會影響外觀與口感。建議存放於 15 至 20 度的陰涼環境，避免冰箱冷藏因濕度高導致受潮。若環境過熱，則需放入冷藏，但要先用密封袋妥善隔絕濕氣。
      </p>

      <h3>堅果與香料的保存</h3>
      <p>
      堅果含有豐富油脂，若保存不當容易氧化變苦。建議存放於密封罐中，並冷藏或冷凍以延長新鮮度。香料則應避免光照與高溫，最好放在深色瓶罐並置於陰涼處。粉末狀香料開封後風味會逐漸流失，建議在半年內使用完畢。
      </p>

      <p>
      總結來說，烘焙食材保存的原則就是「避免受潮、保持低溫、隔絕光線與空氣」。只要遵循這些基本原則，就能延長食材的新鮮度，讓你的蛋糕與餅乾始終保持最佳風味。專業烘焙師傅之所以能維持穩定品質，正是因為他們懂得照顧每一種材料，讓食材在使用前都處於完美狀態。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-rdne-8580726.jpg?alt=media&token=32b9ddcc-0677-4242-a40b-893314f95247",
        publishedAt: new Date(),
        categoryId: ingredientsCompare.id,
        subCategoryId: subIngredientStorage.id,
      },

      {
        title: "烤箱、打蛋機怎麼選？烘焙電器購買指南",
        slug: "baking-appliance-selection",
        excerpt: "挑選合適的烤箱與打蛋機，讓烘焙更輕鬆、更穩定！",
        content: `
      <h2>挑選烤箱的重點</h2>
      <p>
      烤箱是烘焙中最不可或缺的電器，一台好的烤箱能讓作品更穩定、更成功。市面上常見的家用烤箱容量從 20 公升到 60 公升不等，容量越大越能一次烤多盤，但同時也佔用更多空間。對新手而言，建議至少選擇 30 公升以上，這樣能放得下 8 吋蛋糕模與兩層餅乾烤盤，使用上更有彈性。
      </p>

      <h3>溫控與加熱方式</h3>
      <p>
      烤箱的溫度控制精準度直接影響成敗。若預算允許，建議選擇有「上下火獨立控制」的款式，能根據不同食譜調整加熱模式。一般烤箱多為上下加熱管，若能搭配熱風循環功能，能讓受熱更均勻，避免出現局部過焦或中間未熟的狀況。
      </p>

      <h3>實用功能與配件</h3>
      <p>
      烤箱除了基本功能，還可以注意一些貼心設計，例如內建燈方便觀察烘烤過程、雙層玻璃門提升保溫與安全性。配件部分，是否附贈烤盤、網架或轉烤功能，也會影響實際使用便利度。新手選購時，應以「穩定溫度 + 容量合適」為優先考量。
      </p>

      <h2>挑選打蛋機的關鍵</h2>
      <p>
      打蛋機是烘焙中另一個常見的電器，無論是打發蛋白、製作奶油霜或揉麵，都能大幅節省時間與體力。打蛋機分為「手持式」與「立式」兩種，各有優缺點。
      </p>

      <h3>手持式打蛋機</h3>
      <p>
      手持式打蛋機體積小、價格親民，適合烘焙初學者。它能滿足基本的打發需求，但缺點是需要手持操作，長時間容易疲勞，馬力也較弱。若只是偶爾烘焙，手持式打蛋機已經足夠；但若頻繁製作蛋糕或奶油霜，可能需要考慮更高階的機型。
      </p>

      <h3>立式打蛋機</h3>
      <p>
      立式打蛋機擁有強勁馬力與固定攪拌碗，能處理大量食材並解放雙手，非常適合長時間或大批量製作。缺點是價格較高且佔空間大。若打算深入研究烘焙，立式打蛋機是一個值得投資的選擇，特別是品牌款通常還會附贈不同攪拌棒，能應付各種用途。
      </p>

      <p>
      總結來說，選購烤箱與打蛋機時，最重要的是根據自身需求與預算做決定。新手可先從實用性高的基本款開始，隨著烘焙頻率與技術提升，再逐步升級設備。合適的電器能讓烘焙之路更加順利，成果也更穩定。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-asphotography-213162.jpg?alt=media&token=68f21efb-4c8d-4ead-b5bf-7325ea95d0e6",
        publishedAt: new Date(),
        categoryId: bakingTools.id,
        subCategoryId: subApplianceSelection.id,
      },
      {
        title: "精準是成功關鍵！烘焙計量器具挑選全攻略",
        slug: "measuring-tools-guide",
        excerpt: "學會挑選計量工具，讓每次烘焙都精準穩定、零失敗！",
        content: `
      <h2>為什麼計量在烘焙中如此重要？</h2>
      <p>
      烘焙與一般料理最大的不同在於「精準度要求」。一點點的比例誤差，都可能導致蛋糕無法膨脹、餅乾過硬或口感不佳。因此，擁有可靠的計量工具，是每一位烘焙愛好者的必備基礎。從電子秤、量杯到溫度計，每一項工具都在成敗之間扮演重要角色。
      </p>

      <h3>電子秤的挑選</h3>
      <p>
      電子秤是烘焙中最不可或缺的工具。挑選時要注意「最小刻度」與「最大秤重」。建議選擇最小刻度 1 公克、最大秤重 3 至 5 公斤的款式，能涵蓋大部分食譜需求。此外，具備去皮功能、背光螢幕與防水設計，也能提升使用便利性與耐用度。
      </p>

      <h3>量杯與量匙的選擇</h3>
      <p>
      量杯與量匙適合快速量取液體或小量食材。選購時建議挑選刻度清晰、不易磨損的款式。玻璃量杯耐熱，可直接用於微波；塑膠款則輕便但需避免高溫。量匙則應準備一整組，確保能對應到食譜中的各種單位。專業烘焙師通常會同時搭配電子秤與量杯，提升效率與精準度。
      </p>

      <h2>進階計量工具的應用</h2>
      <p>
      除了基本的電子秤與量杯，還有一些進階計量工具，能讓作品更加穩定。溫度計與定時器就是其中兩個常被忽略但極其重要的工具。掌握時間與溫度，才能真正做到每一批甜點都一致。
      </p>

      <h3>烤箱溫度計</h3>
      <p>
      許多家用烤箱的實際溫度與顯示面板往往存在誤差。烤箱溫度計能幫助你精準掌握內部溫度，避免蛋糕內生外焦或餅乾烤不均勻。這是一個小投資，卻能大幅提升成功率。
      </p>

      <h3>定時器與其他輔助工具</h3>
      <p>
      定時器能避免因分心而錯過最佳烘烤時間。雖然手機也有計時功能，但專用定時器更直覺且能同時設定多組時間。其他如糖度計、溫度探針，則適合進階烘焙者使用，能讓甜點更貼近專業水準。
      </p>

      <p>
      總結來說，計量工具雖然常被忽視，但卻是影響烘焙成敗的關鍵。從電子秤到溫度計，每一項都值得投資。只要工具齊全又合適，就能大幅減少失敗率，讓你在烘焙的道路上更加順利，每一次都能烤出完美的成品。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-ron-lach-10046954.jpg?alt=media&token=d3db18f7-6d7e-42fd-81ac-f964960fc91f",
        publishedAt: new Date(),
        categoryId: bakingTools.id,
        subCategoryId: subMeasuringTools.id,
      },
      {
        title: "烘焙成品包裝指南：美觀、保鮮與送禮的最佳選擇",
        slug: "baking-packaging-guide",
        excerpt: "學會選對包裝，讓烘焙成品兼顧美觀、保鮮與送禮體面！",
        content: `
      <h2>包裝的重要性</h2>
      <p>
      烘焙成品不只是味道好，外觀與包裝同樣能影響整體體驗。無論是自用保存，還是作為禮物贈送，合適的包裝能延長新鮮度、維持口感，並提升質感。特別是餅乾、蛋糕與麵包等不同類型的烘焙品，需要根據特性挑選適合的包裝方式，才能兼顧美觀與實用。
      </p>

      <h3>餅乾與小點心的包裝</h3>
      <p>
      餅乾屬於容易受潮的產品，建議使用密封袋或小鐵盒保存，並搭配乾燥劑保持酥脆。若作為禮物，可選擇透明包裝袋加上蝴蝶結或貼紙，既能展示內容物，又能營造精緻感。馬卡龍、小蛋白餅等精巧甜點，則適合放入專用塑膠盒，避免碰撞碎裂。
      </p>

      <h3>蛋糕與麵包的包裝</h3>
      <p>
      蛋糕通常需要專用蛋糕盒，建議選擇硬挺材質，確保運送過程中不會變形。海綿蛋糕或戚風蛋糕可搭配透明窗設計，方便展示。麵包則可以使用紙袋或塑膠袋，依照是否需要保濕來選擇材質。如果是歐式硬麵包，紙袋能維持外皮酥脆；若是軟麵包，則建議使用塑膠袋避免乾燥。
      </p>

      <h2>兼顧美觀與送禮的技巧</h2>
      <p>
      當烘焙成品要作為伴手禮或節慶禮盒時，美觀設計就更為重要。包裝不僅要保護食材，還要傳達心意與風格。透過顏色搭配、材質選擇與小巧思，就能讓禮品更具特色。
      </p>

      <h3>禮盒與配件選擇</h3>
      <p>
      常見的禮盒材質有紙盒、鐵盒與木盒。紙盒輕巧且便宜，適合大量製作；鐵盒耐用且高級感十足，能延長保存時間；木盒則有自然質樸的氛圍，適合強調手作感。再搭配絲帶、乾燥花或吊牌，就能展現個人風格與巧思。
      </p>

      <h3>提升質感的小細節</h3>
      <p>
      除了外包裝，內襯的選擇也很重要。蠟紙、牛皮紙或蕾絲紙墊能讓成品更精緻，還能吸收多餘油脂。透明封膜或收縮膜則能保持衛生與防塵，特別適合長途運送或販售。小卡片、手寫祝福語，更能傳遞溫度與心意。
      </p>

      <p>
      總結來說，烘焙成品的包裝不只是外觀裝飾，而是兼具保鮮、美觀與實用的整體方案。只要根據產品特性與用途選擇適合的方式，不論是自用還是送禮，都能讓甜點更具價值感，留下深刻印象。
      </p>
    `,
        coverImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Farticles%2Fpexels-cottonbro-6063706.jpg?alt=media&token=df212e05-266d-4908-ade3-6be614ef4234",
        publishedAt: new Date(),
        categoryId: bakingTools.id,
        subCategoryId: subPackagingSelection.id,
      },
    ],
  });

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
            slug: "cream-cakes",
            orderIndex: 1,
          },
          { name: "生巧克力系列", slug: "chocolate", orderIndex: 2 },
          { name: "精緻藝術蛋糕", slug: "art-cakes", orderIndex: 3 },
          { name: "造型杯子蛋糕", slug: "cupcakes", orderIndex: 4 },
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

  const macarons = await prisma.product_category.create({
    data: {
      name: "馬卡龍",
      slug: "macarons",
      description: "外脆內軟、香氣濃郁的法式馬卡龍系列。",
      orderIndex: 3,
      subcategories: {
        create: [
          { name: "果香馬卡龍", slug: "fruit-macarons", orderIndex: 1 },
          { name: "茶香馬卡龍", slug: "tea-macarons", orderIndex: 2 },
          { name: "經典馬卡龍", slug: "classic-macarons", orderIndex: 3 },
        ],
      },
    },
    include: { subcategories: true },
  });

  // 取出子分類
  const subSignatureCream = classicCakes.subcategories.find(
    (s) => s.slug === "cream-cakes"
  );
  const subChocolateCakes = classicCakes.subcategories.find(
    (s) => s.slug === "chocolate"
  );
  const subArtCakes = classicCakes.subcategories.find(
    (s) => s.slug === "art-cakes"
  );
  const subCupcakes = classicCakes.subcategories.find(
    (s) => s.slug === "cupcakes"
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

  const subFruitMacarons = macarons.subcategories.find(
    (s) => s.slug === "fruit-macarons"
  );
  const subTeaMacarons = macarons.subcategories.find(
    (s) => s.slug === "tea-macarons"
  );
  const subClassicMacarons = macarons.subcategories.find(
    (s) => s.slug === "classic-macarons"
  );

  // 建立產品
  console.log("Creating products...");

  // 招牌鮮奶油蛋糕
  await prisma.product.create({
    data: {
      name: "香草奶油蛋糕",
      slug: "vanilla-butter-cake",
      description: "手作香草奶油，口感綿密。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-anna-nekrashevich-7552323.jpg?alt=media&token=cca9caf9-fbfc-4a8d-b8ef-627bf5736b52",
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
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-catscoming-835752.jpg?alt=media&token=527f10c9-efc8-4960-9965-d5ac431a4881",
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

  await prisma.product.create({
    data: {
      name: "小山園抹茶鮮奶油蛋糕",
      slug: "matcha-cream-cake",
      description: "嚴選小山園抹茶粉製作，茶香濃郁而回甘。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-catscoming-1543800.jpg?alt=media&token=a79f599e-13f9-4fb6-90d5-a3a6df157ac6",
      categoryId: classicCakes.id,
      subcategoryId: subSignatureCream?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、新鮮雞蛋、鮮奶油、小山園抹茶粉、細砂糖",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "採用日本宇治小山園抹茶粉製作，帶有高雅茶香與微苦回甘。鮮奶油層輕盈細膩，搭配柔軟蛋糕體，展現出抹茶與奶香的完美平衡。甜度低、香氣馥郁，是抹茶控不能錯過的經典款。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 880, isDefault: true },
          { variantName: "8吋", price: 1180 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "香蕉巧克力鮮奶油蛋糕",
      slug: "banana-choco-cream-cake",
      description: "香甜香蕉與濃郁巧克力的完美結合。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-dhayaeddart-5276663.jpg?alt=media&token=4ef721a1-a1d5-483a-97fb-d000053892ef",
      categoryId: classicCakes.id,
      subcategoryId: subSignatureCream?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、雞蛋、砂糖、香蕉泥、黑巧克力、鮮奶油",
      shelfLife: "冷藏保存2天，冷凍保存5天",
      flavorProfile:
        "以熟成香蕉泥與高純度可可粉製作，香氣濃郁。蛋糕體柔軟濕潤，夾層中加入巧克力鮮奶油與香蕉切片，帶來層次豐富的口感，是小朋友與大人都愛的甜點組合。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 880, isDefault: true },
          { variantName: "8吋", price: 1180 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "烤杏仁鮮奶油水果蛋糕",
      slug: "almond-fruit-cake",
      description: "烘烤杏仁片香氣濃郁，搭配新鮮水果裝飾。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-chiecharon-1027811.jpg?alt=media&token=00da7bb9-9b3e-4a97-aa19-b16817777f69",
      categoryId: classicCakes.id,
      subcategoryId: subSignatureCream?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、新鮮雞蛋、鮮奶油、杏仁片、時令水果、砂糖",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "以輕盈奶油蛋糕為基底，外層鋪上香脆烤杏仁片，並以時令水果裝飾，甜度清爽。口感層次多變，杏仁香與水果酸甜交織，呈現自然又細膩的風味。",
      productvariant: {
        create: [{ variantName: "8吋", price: 1080, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "復古櫻桃蛋糕",
      slug: "retro-cherry-cake",
      description: "經典復古造型與濃郁櫻桃風味，重現懷舊時光。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-natalya-choohrova-118638025-9834064.jpg?alt=media&token=ce34ab4d-79fe-43f2-a98a-fa1706ec022a",
      categoryId: classicCakes.id,
      subcategoryId: subSignatureCream?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、雞蛋、鮮奶油、櫻桃果醬、黑櫻桃、砂糖、可可粉",
      shelfLife: "冷藏保存3天",
      flavorProfile:
        "靈感來自歐式復古蛋糕，以可可蛋糕層夾入櫻桃果餡與奶油，甜中帶酸。表層鋪滿鮮紅櫻桃與巧克力碎片，外觀華麗復古，風味濃郁迷人。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 880, isDefault: true },
          { variantName: "8吋", price: 1180 },
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
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-angelicabritto-31111197.jpg?alt=media&token=835ba938-3dd6-49a3-bd6d-437bbc2b8e3b",
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

  // --- 經典蛋糕：生巧克力蛋糕 ---
  await prisma.product.create({
    data: {
      name: "巧克力布朗尼",
      slug: "chocolate-brownie",
      description: "濃郁可可與堅果香氣的經典布朗尼。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-livilla-latini-1678510737-27850026.jpg?alt=media&token=52dd3574-60f9-4314-821b-9041ba75b37b",
      categoryId: classicCakes.id,
      subcategoryId: subChocolateCakes?.id ?? null,
      isHot: true,
      ingredients: "黑巧克力、無鹽奶油、砂糖、雞蛋、麵粉、核桃碎",
      shelfLife: "常溫下2天，冷藏保存5天",
      flavorProfile:
        "選用高純度比利時巧克力製作，質地紮實、香氣濃郁，帶有微苦口感。核桃碎增加口感層次，冷藏後更顯濕潤與濃厚，搭配咖啡風味絕佳。",
      productvariant: {
        create: [
          { variantName: "單片", price: 120, isDefault: true },
          { variantName: "6入禮盒", price: 660 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "松露生巧克力蛋糕",
      slug: "truffle-choco-cake",
      description: "如松露般濃厚滑順的巧克力風味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-marta-dzedyshko-1042863-6341572.jpg?alt=media&token=dfbbe5a7-8e11-44de-a628-223f1553f83f",
      categoryId: classicCakes.id,
      subcategoryId: subChocolateCakes?.id ?? null,
      isHot: false,
      ingredients: "黑巧克力、鮮奶油、可可粉、雞蛋、砂糖",
      shelfLife: "冷藏保存4天，冷凍保存10天",
      flavorProfile:
        "以生巧克力般的內餡與濕潤蛋糕層組成，入口即化。可可香濃厚深沉，微苦中帶甜，是大人味的高級甜點。",
      productvariant: {
        create: [{ variantName: "6吋", price: 880, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "巧克力慕斯派對杯",
      slug: "choco-mousse-cup",
      description: "滑順慕斯與可可餅乾層的完美結合。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-ella-olsson-572949-3026810.jpg?alt=media&token=5d482d1d-c993-46c9-b71b-c0e9078730aa",
      categoryId: classicCakes.id,
      subcategoryId: subChocolateCakes?.id ?? null,
      isHot: true,
      ingredients: "黑巧克力、鮮奶油、餅乾碎、砂糖、可可粉",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "層層堆疊的可可慕斯、鮮奶油與餅乾碎，入口即化，口感輕盈卻香氣濃厚。適合派對與下午茶，是最受歡迎的甜點杯系列之一。",
      productvariant: {
        create: [{ variantName: "單杯", price: 180, isDefault: true }],
      },
    },
  });

  // --- 經典蛋糕：精緻藝術蛋糕 ---
  await prisma.product.create({
    data: {
      name: "焦糖可可脆片翻糖蛋糕",
      slug: "caramel-choco-fondant-cake",
      description: "金色焦糖與可可脆片裝飾的高級翻糖設計。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-javon-swaby-197616-1829423.jpg?alt=media&token=75da8514-d64d-4caa-917c-2e602bbcdc21",
      categoryId: classicCakes.id,
      subcategoryId: subArtCakes?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、可可粉、鮮奶油、焦糖醬、糖珠、翻糖皮",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "結合可可蛋糕體與焦糖內餡，外層以手工翻糖與可可脆片裝飾。外觀華麗、口感豐富，甜中帶有微苦焦糖香，是高質感宴會蛋糕首選。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 1580, isDefault: true },
          { variantName: "8吋", price: 1980 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "花藝婚禮蛋糕",
      slug: "floral-wedding-cake",
      description: "以鮮花裝飾的浪漫婚禮蛋糕，典雅細緻。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-brent-keane-181485-1702373.jpg?alt=media&token=f2d087f3-cb46-4bd5-ba31-ba96b33123c6",
      categoryId: classicCakes.id,
      subcategoryId: subArtCakes?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、雞蛋、奶油、鮮奶油、可食用鮮花、砂糖",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "柔軟香草蛋糕體搭配輕盈鮮奶油，外層以可食用鮮花與緞帶裝飾，呈現出自然典雅的氛圍。甜度低、香氣清新，是婚禮與典禮的浪漫代表。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 1980, isDefault: true },
          { variantName: "8吋", price: 2480 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "粉紅玫瑰奶霜蛋糕",
      slug: "pink-rose-buttercream-cake",
      description: "粉嫩奶霜與玫瑰香氣交織的夢幻設計。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-jill-wellington-1638660-433527.jpg?alt=media&token=06f0eec6-6d50-4916-a2a2-9d5be2fd6837",
      categoryId: classicCakes.id,
      subcategoryId: subArtCakes?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、奶油霜、玫瑰香精、鮮奶油、蛋白糖霜",
      shelfLife: "冷藏保存3天",
      flavorProfile:
        "使用天然玫瑰精油與奶油霜調製，外層以粉紅色調裝飾，甜而不膩。口感柔滑細膩，香氣浪漫，非常適合生日或紀念日慶祝。",
      productvariant: {
        create: [
          { variantName: "6吋", price: 1480, isDefault: true },
          { variantName: "8吋", price: 1880 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "楊枝甘露芒果雪崩蛋糕",
      slug: "mango-yangzhi-cake",
      description: "結合港式甜品靈感的創意雪崩蛋糕。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-suki-lee-110686949-15730547.jpg?alt=media&token=0c15c212-49cb-4c50-85b9-890516a077b2",
      categoryId: classicCakes.id,
      subcategoryId: subArtCakes?.id ?? null,
      isHot: true,
      ingredients: "雞蛋、低筋麵粉、芒果泥、椰奶、奶霜、葡萄柚果粒",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "以楊枝甘露為靈感，內餡含芒果泥與椰奶奶霜，表面覆上鮮果與果醬，切開瞬間流出香甜芒果漿，酸甜爽口又驚艷。",
      productvariant: {
        create: [{ variantName: "6吋", price: 1380, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "柑橘擠花蛋糕",
      slug: "citrus-piping-cake",
      description: "酸甜清新的柑橘風味與擠花奶霜設計。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-catscoming-9419880.jpg?alt=media&token=64250245-ad3f-4265-acdb-c5c2e5527678",
      categoryId: classicCakes.id,
      subcategoryId: subArtCakes?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、檸檬皮、柳橙果泥、奶油霜、砂糖",
      shelfLife: "冷藏保存3天",
      flavorProfile:
        "以柑橘果泥與檸檬皮製作蛋糕體，清新酸甜。搭配手工擠花奶霜裝飾，口感輕盈、香氣自然，是夏季清爽代表作。",
      productvariant: {
        create: [{ variantName: "6吋", price: 1280, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "愛戀草莓心型蛋糕",
      slug: "heart-strawberry-cake",
      description: "浪漫心型造型，滿滿草莓與奶霜的甜蜜滋味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-ph-m-thanh-d-t-1295528-4424640.jpg?alt=media&token=710503fd-4435-4a1b-bf8d-fa1924088889",
      categoryId: classicCakes.id,
      subcategoryId: subArtCakes?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、草莓、鮮奶油、砂糖、雞蛋",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "使用新鮮草莓與奶霜製作，整體呈現粉嫩心型外觀。口感柔軟細緻，酸甜香氣讓人一口就愛上，極具節慶氛圍。",
      productvariant: {
        create: [{ variantName: "6吋心型", price: 1380, isDefault: true }],
      },
    },
  });

  // --- 經典蛋糕：造型杯子蛋糕 ---
  await prisma.product.create({
    data: {
      name: "經典黑巧杯子蛋糕",
      slug: "classic-choco-cupcake",
      description: "濃郁可可風味與柔軟蛋糕體的經典款。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-guvo59-20731156.jpg?alt=media&token=8e0224bd-c76e-4b09-b324-130559ba55df",
      categoryId: classicCakes.id,
      subcategoryId: subCupcakes?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、黑巧克力、可可粉、雞蛋、砂糖、鮮奶油",
      shelfLife: "常溫下1天，冷藏保存3天",
      flavorProfile:
        "濃郁的可可香氣搭配柔軟濕潤的蛋糕體，頂層擠上巧克力奶霜，甜度適中。經典不敗、老少咸宜。",
      productvariant: {
        create: [
          { variantName: "4入組", price: 280, isDefault: true },
          { variantName: "8入組", price: 520 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "提拉米蘇杯子蛋糕",
      slug: "tiramisu-cupcake",
      description: "將提拉米蘇濃郁風味融入杯子蛋糕中。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-dogu-tuncer-339534179-16134541.jpg?alt=media&token=6877e2ed-47e9-4db1-b4d7-4bf815e44fd1",
      categoryId: classicCakes.id,
      subcategoryId: subCupcakes?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、馬斯卡彭乳酪、咖啡液、可可粉、雞蛋、砂糖",
      shelfLife: "冷藏保存3天",
      flavorProfile:
        "以馬斯卡彭乳酪與咖啡糖液製作，口感柔滑、香氣馥郁。濃厚卻不膩的奶香與可可粉完美融合，是成人味甜點首選。",
      productvariant: {
        create: [{ variantName: "4入組", price: 320, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "粉紅愛心擠花杯子蛋糕",
      slug: "heart-piping-cupcake",
      description: "粉嫩愛心擠花造型，情人節限定甜點。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-saveurssecretes-6815973.jpg?alt=media&token=4664bbd6-35f0-4126-acd4-dc4ec8869508",
      categoryId: classicCakes.id,
      subcategoryId: subCupcakes?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、奶油霜、鮮奶油、天然色素、砂糖",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "外型以愛心擠花設計，色彩柔和甜美。奶霜滑順不膩，整體風味清爽，特別受情人節與慶生場合歡迎。",
      productvariant: {
        create: [{ variantName: "6入禮盒", price: 480, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "玫瑰造型杯子蛋糕",
      slug: "rose-cupcake",
      description: "以玫瑰花形奶霜裝飾的浪漫甜點。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-lukato-8874017.jpg?alt=media&token=264e5f93-d971-4e6c-9e87-ba34e7d779bf",
      categoryId: classicCakes.id,
      subcategoryId: subCupcakes?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、奶油霜、香草粉、鮮奶油、食用玫瑰",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "外層以玫瑰花造型擠花呈現，香氣高雅。蛋糕體鬆軟、奶霜滑順，甜度適中，是禮盒與婚禮甜點的熱門選項。",
      productvariant: {
        create: [{ variantName: "4入禮盒", price: 420, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "聖誕樹造型杯子蛋糕",
      slug: "christmas-tree-cupcake",
      description: "聖誕限定款，以奶霜堆疊成可愛聖誕樹造型。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-tim-douglas-6210740.jpg?alt=media&token=7a0d0484-ad7d-4161-997f-454e7d2eba09",
      categoryId: classicCakes.id,
      subcategoryId: subCupcakes?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、奶油霜、抹茶粉、食用糖珠、砂糖",
      shelfLife: "冷藏保存2天",
      flavorProfile:
        "使用抹茶奶霜與巧克力蛋糕體，堆疊出立體聖誕樹造型。外觀夢幻可愛、香氣濃郁，是節慶限定必備甜點。",
      productvariant: {
        create: [{ variantName: "4入組", price: 360, isDefault: true }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "草莓紅絲絨杯子蛋糕",
      slug: "red-velvet-cupcake",
      description: "鮮紅蛋糕體搭配草莓奶霜，經典美式風格。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-rawan-ali-133113257-28122547.jpg?alt=media&token=71d8cd86-b4d9-47f1-9c92-f414a9be79d2",
      categoryId: classicCakes.id,
      subcategoryId: subCupcakes?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、可可粉、天然紅麴粉、鮮奶油、草莓果泥",
      shelfLife: "冷藏保存3天",
      flavorProfile:
        "紅絲絨蛋糕體濕潤細膩，與草莓奶霜融合出酸甜層次。色澤討喜、風味經典，是節慶與聚會的亮眼甜點。",
      productvariant: {
        create: [{ variantName: "4入組", price: 380, isDefault: true }],
      },
    },
  });

  // 軟心巧克力餅乾
  await prisma.product.create({
    data: {
      name: "軟心巧克力餅乾",
      slug: "soft-choco-cookie",
      description: "美式經典軟餅乾，濃郁巧克力。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-razaneadra-14136384.jpg?alt=media&token=16aa6dec-ed03-45e8-9d56-e59852129d39",
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
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-louai-benzaoui-435435842-20653559.jpg?alt=media&token=e22e62d7-7d93-4d0b-88b3-8df677a43b4f",
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

  // --- 手工餅乾：港式曲奇餅 ---
  await prisma.product.create({
    data: {
      name: "小山園抹茶曲奇",
      slug: "matcha-hk-cookie",
      description: "濃郁抹茶香氣，酥鬆可口。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-catscoming-771455.jpg?alt=media&token=6cbb51aa-4ecb-4ea5-beb8-8328f50c934a",
      categoryId: handmadeCookies.id,
      subcategoryId: subHkCookies?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、無鹽奶油、抹茶粉、砂糖、雞蛋",
      shelfLife: "常溫下7天，冷藏保存14天",
      flavorProfile:
        "選用小山園抹茶粉調製，香氣高雅、甜度低，質地細緻酥鬆，是抹茶控的下午茶必備點心。",
      productvariant: {
        create: [
          { variantName: "小盒", price: 240, isDefault: true },
          { variantName: "大盒", price: 400 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "聖誕樹翻糖餅乾",
      slug: "xmas-fondant-cookie",
      description: "聖誕節限定款，繽紛翻糖造型餅乾。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-ekaterina-bolovtsova-5702693.jpg?alt=media&token=a567f3d6-ed18-453f-97ad-2ec71c267452",
      categoryId: handmadeCookies.id,
      subcategoryId: subHkCookies?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、無鹽奶油、糖粉、蛋白霜、食用色素",
      shelfLife: "常溫下10天，密封保存14天",
      flavorProfile:
        "以糖霜與翻糖製作各式聖誕造型，如雪人、聖誕樹與薑餅人。外型華麗，甜度高但香氣濃郁，適合節慶贈禮。",
      productvariant: {
        create: [
          { variantName: "6入組", price: 360, isDefault: true },
          { variantName: "12入禮盒", price: 680 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "焦糖奶油曲奇",
      slug: "caramel-cookie",
      description: "香濃焦糖與奶油香氣完美融合。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-catscoming-785420.jpg?alt=media&token=e64b95e9-4556-47b8-8c8b-9f0ca15f1a1f",
      categoryId: handmadeCookies.id,
      subcategoryId: subHkCookies?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、無鹽奶油、砂糖、焦糖醬、雞蛋",
      shelfLife: "常溫下7天，冷藏保存14天",
      flavorProfile:
        "烘烤焦糖醬與奶油融合出的香氣迷人，口感酥鬆細膩，甜中帶鹹，越吃越涮嘴。",
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
      name: "酸甜蔓越莓曲奇",
      slug: "cranberry-cookie",
      description: "蔓越莓果乾點綴其中，酸甜清爽。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-meggy-kadam-aryanto-3797063-9620137.jpg?alt=media&token=ad217d1f-e3fb-41a1-8878-74d02f52e1f5",
      categoryId: handmadeCookies.id,
      subcategoryId: subHkCookies?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、無鹽奶油、砂糖、蔓越莓果乾、雞蛋",
      shelfLife: "常溫下7天，冷藏保存14天",
      flavorProfile:
        "蔓越莓果乾在曲奇中帶來酸甜風味與果香層次，清爽不膩、外酥內鬆，是女性顧客的最愛。",
      productvariant: {
        create: [
          { variantName: "小盒", price: 230, isDefault: true },
          { variantName: "大盒", price: 390 },
        ],
      },
    },
  });

  // --- 手工餅乾：美式軟餅乾 ---
  await prisma.product.create({
    data: {
      name: "抹茶白巧愛心軟餅乾",
      slug: "matcha-white-choco-cookie",
      description: "清新抹茶香氣，搭配香濃白巧克力。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-darlene-alderson-7016489.jpg?alt=media&token=96ff1014-bfd1-402f-9591-2ebb27286283",
      categoryId: handmadeCookies.id,
      subcategoryId: subSoftCookies?.id ?? null,
      isHot: false,
      ingredients: "中筋麵粉、無鹽奶油、抹茶粉、白巧克力豆、雞蛋、砂糖",
      shelfLife: "常溫下3天，冷藏保存7天",
      flavorProfile:
        "嚴選日本宇治抹茶粉與白巧克力豆製作，甜中帶苦、香氣清新。外層略酥、中心柔軟，是抹茶控的療癒系甜點。",
      productvariant: {
        create: [
          { variantName: "4入", price: 180, isDefault: true },
          { variantName: "8入", price: 340 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "玫瑰白巧愛心軟餅乾",
      slug: "rose-white-choco-cookie",
      description: "浪漫玫瑰香氣與白巧克力的夢幻組合。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-jill-wellington-1638660-6814664.jpg?alt=media&token=6a126192-2884-4fa6-9332-7cf1579d042f",
      categoryId: handmadeCookies.id,
      subcategoryId: subSoftCookies?.id ?? null,
      isHot: true,
      ingredients: "中筋麵粉、無鹽奶油、白巧克力豆、玫瑰花瓣、雞蛋、砂糖",
      shelfLife: "常溫下3天，冷藏保存7天",
      flavorProfile:
        "使用可食用玫瑰花瓣與白巧克力豆，香氣清新優雅。外型愛心可愛，適合節日或伴手禮，甜度適中。",
      productvariant: {
        create: [
          { variantName: "4入", price: 200, isDefault: true },
          { variantName: "8入", price: 360 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "堅果燕麥軟餅乾",
      slug: "oat-nut-cookie",
      description: "香脆堅果與燕麥結合，口感豐富又健康。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-meraki-photos-3596636-5379521.jpg?alt=media&token=0e75950b-0ef6-47a6-aaac-41e6df1097dd",
      categoryId: handmadeCookies.id,
      subcategoryId: subSoftCookies?.id ?? null,
      isHot: false,
      ingredients: "中筋麵粉、燕麥片、核桃、杏仁片、無鹽奶油、砂糖、雞蛋",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "採用新鮮烘烤堅果與燕麥片，香氣濃郁，外酥內軟、甜度清爽，是健康取向甜點愛好者的最愛。",
      productvariant: {
        create: [
          { variantName: "4入", price: 160, isDefault: true },
          { variantName: "8入", price: 300 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "香濃花生巧克力軟餅乾",
      slug: "peanut-choco-cookie",
      description: "濃郁花生與黑巧克力雙重香氣。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-tiago-antonio-530108832-28786988.jpg?alt=media&token=944aa2bd-84de-4fd4-bb32-88f4a936d039",
      categoryId: handmadeCookies.id,
      subcategoryId: subSoftCookies?.id ?? null,
      isHot: true,
      ingredients: "中筋麵粉、無鹽奶油、黑巧克力豆、花生醬、砂糖、雞蛋",
      shelfLife: "常溫下3天，冷藏保存7天",
      flavorProfile:
        "花生醬與黑巧克力豆完美融合，甜鹹平衡。外層略酥、中心濕潤濃郁，是經典的美式家庭風味。",
      productvariant: {
        create: [
          { variantName: "4入", price: 180, isDefault: true },
          { variantName: "8入", price: 340 },
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
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-ella-olsson-572949-3026811.jpg?alt=media&token=956d6191-533e-463f-ad35-4dfd549b5964",
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

  // --- 手工餅乾：雪球餅乾 ---
  await prisma.product.create({
    data: {
      name: "黑可可雪球餅乾",
      slug: "dark-cocoa-snowball",
      description: "濃郁黑可可香氣，外酥內鬆的雪球口感。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-melissa-huntsman-23514224-6661117.jpg?alt=media&token=9fea4132-22a8-4891-92a7-c1b9414e974e",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、可可粉、無鹽奶油、糖粉、香草粉",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "使用高純度黑可可粉製成，苦甜比例完美。外層裹上糖粉，外酥內鬆、香氣濃郁，是大人味的經典選擇。",
      productvariant: {
        create: [
          { variantName: "12入", price: 280, isDefault: true },
          { variantName: "24入禮盒", price: 520 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "小山園抹茶雪球餅乾",
      slug: "matcha-snowball",
      description: "清新抹茶香氣、口感酥鬆綿密。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-alesiakozik-6546570.jpg?alt=media&token=a8fbf711-a6d6-4720-b4b5-fa9ecff90910",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、無鹽奶油、糖粉、小山園抹茶粉、香草粉",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "使用小山園抹茶粉調製，帶有淡淡茶香與微苦回甘。外層裹粉輕盈、甜度低，是抹茶控必備小點。",
      productvariant: {
        create: [
          { variantName: "12入", price: 300, isDefault: true },
          { variantName: "24入禮盒", price: 560 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "法式椰絲雪球餅乾",
      slug: "coconut-snowball",
      description: "滿滿椰絲香氣的異國風雪球餅乾。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-melissa-huntsman-23514224-6661118.jpg?alt=media&token=ec6ed132-de3f-4228-b8aa-beb1193899fe",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、無鹽奶油、糖粉、椰絲、鮮奶油",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "以法式比例烘焙，添加細緻椰絲增添香氣，口感輕盈酥鬆、甜中帶椰香。搭配茶或咖啡都十分合拍。",
      productvariant: {
        create: [
          { variantName: "12入", price: 280, isDefault: true },
          { variantName: "24入禮盒", price: 520 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "焦糖雪球餅乾",
      slug: "caramel-snowball",
      description: "焦糖香氣濃郁、入口即化的雪球餅乾。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-cphbythea-5604808.jpg?alt=media&token=8f1ef590-c3fa-4b21-8625-fbc8647b690c",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、無鹽奶油、糖粉、焦糖醬、香草粉",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "以自製焦糖醬拌入餅乾麵糰，甜中帶微苦，香氣溫潤。糖粉與焦糖香結合，風味濃厚卻不膩口。",
      productvariant: {
        create: [
          { variantName: "12入", price: 300, isDefault: true },
          { variantName: "24入禮盒", price: 560 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "黃檸檬雪球餅乾",
      slug: "lemon-snowball",
      description: "清新檸檬皮香氣，爽口不甜膩。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-melissa-huntsman-23514224-6661118.jpg?alt=media&token=ec6ed132-de3f-4228-b8aa-beb1193899fe",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: false,
      ingredients: "低筋麵粉、無鹽奶油、糖粉、檸檬皮屑、檸檬汁",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "使用新鮮黃檸檬汁與檸檬皮屑，酸香提味。外層糖粉微甜中帶酸，整體清爽怡人，夏季限定推薦。",
      productvariant: {
        create: [
          { variantName: "12入", price: 280, isDefault: true },
          { variantName: "24入禮盒", price: 520 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "櫻花白巧克力雪球餅乾",
      slug: "sakura-whitechoco-snowball",
      description: "粉嫩櫻花與白巧克力融合的浪漫滋味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-daria86-8306609.jpg?alt=media&token=d87ab781-6ae4-4746-9387-7536635916a2",
      categoryId: handmadeCookies.id,
      subcategoryId: subSnowballCookies?.id ?? null,
      isHot: true,
      ingredients: "低筋麵粉、無鹽奶油、糖粉、櫻花粉、白巧克力豆",
      shelfLife: "常溫下5天，冷藏保存10天",
      flavorProfile:
        "以櫻花粉與白巧克力調製，香氣柔和花香淡雅。外觀粉嫩可愛，適合春季限定販售或禮盒搭配。",
      productvariant: {
        create: [
          { variantName: "12入", price: 320, isDefault: true },
          { variantName: "24入禮盒", price: 580 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "玫瑰花茶馬卡龍",
      slug: "rose-tea-macaron",
      description: "玫瑰花香與奶香交織的浪漫滋味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-jill-wellington-1638660-3776939.jpg?alt=media&token=ad0f6e7e-2f64-4bc4-a9ec-3f2c8fe2dc51",
      categoryId: macarons.id,
      subcategoryId: subTeaMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、奶油霜、玫瑰花瓣、花茶粉",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "以玫瑰花茶粉與奶油霜調和，香氣柔和優雅。外層酥脆、內餡滑順，口感細緻夢幻。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "桂花荔枝馬卡龍",
      slug: "osmanthus-lychee-macaron",
      description: "荔枝果香融合桂花清香，清新雅緻。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-valeriya-7474225.jpg?alt=media&token=c4278135-f5e3-4402-89c2-c66ec99e9530",
      categoryId: macarons.id,
      subcategoryId: subTeaMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、荔枝果泥、桂花糖漿",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "清新的桂花香氣搭配荔枝果泥內餡，甜而不膩。香氣層次豐富，口感柔和。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "薰衣草茶馬卡龍",
      slug: "lavender-macaron",
      description: "淡淡薰衣草香氣，帶來寧靜的甜味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-jill-wellington-1638660-3776947.jpg?alt=media&token=508d9045-96ae-4286-9692-4a868c157877",
      categoryId: macarons.id,
      subcategoryId: subTeaMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、奶油霜、薰衣草花瓣",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "加入法國乾燥薰衣草花瓣與香草奶霜，甜度柔和，香氣清新，是大人味的優雅甜點。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "粉紅櫻花馬卡龍",
      slug: "sakura-macaron",
      description: "粉嫩櫻花香氣，春季限定款。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-valeriya-7474292.jpg?alt=media&token=41195c10-4632-42fb-9d49-09907c36e7a3",
      categoryId: macarons.id,
      subcategoryId: subTeaMacarons.id,
      isHot: true,
      ingredients: "杏仁粉、糖粉、蛋白、奶油霜、櫻花粉、鹽漬櫻花",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "以櫻花粉與奶霜調和，甜中帶花香。外觀粉嫩可愛，帶有春日氛圍感。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 190, isDefault: true },
          { variantName: "6入組", price: 360 },
          { variantName: "12入禮盒", price: 680 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "藍伯爵馬卡龍",
      slug: "earlgrey-macaron",
      description: "濃郁伯爵茶香與奶香完美融合。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-tamanna-rumee-52377920-30411004.jpg?alt=media&token=17300543-9193-43d3-9e6c-b69a3e339c66",
      categoryId: macarons.id,
      subcategoryId: subTeaMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、奶油霜、伯爵茶葉粉",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "以伯爵紅茶粉與奶油霜融合，香氣高雅、茶味濃郁，是最受歡迎的茶香口味之一。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "凍頂烏龍茶馬卡龍",
      slug: "oolong-macaron",
      description: "茶香濃厚、尾韻回甘的台灣風味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-mariah-green-3624629-5423257.jpg?alt=media&token=d4d3ed3b-c709-4cbb-b23b-f13851996b4b",
      categoryId: macarons.id,
      subcategoryId: subTeaMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、奶油霜、烏龍茶粉",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "選用南投凍頂烏龍茶粉製作，香氣濃郁、帶花香與蜜韻。融合奶霜後滑順香醇。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "黃檸檬馬卡龍",
      slug: "lemon-macaron",
      description: "清新檸檬香氣與酸甜奶霜交織。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-marta-dzedyshko-1042863-7597264.jpg?alt=media&token=5fbdfeeb-5612-4127-9309-2069637d8448",
      categoryId: macarons.id,
      subcategoryId: subFruitMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、檸檬汁、檸檬皮、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "帶有自然檸檬酸香與滑順奶霜的平衡風味，甜中帶酸、香氣清新。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "覆盆莓馬卡龍",
      slug: "raspberry-macaron",
      description: "酸甜覆盆莓果餡，色澤鮮豔。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-isaw-company-66472-1005405.jpg?alt=media&token=1f667bfd-53fe-4f2c-af17-705b74ce2408",
      categoryId: macarons.id,
      subcategoryId: subFruitMacarons.id,
      isHot: true,
      ingredients: "杏仁粉、糖粉、蛋白、覆盆莓泥、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile: "酸甜濃郁的覆盆莓果香與奶霜結合，甜度剛好，顏色粉嫩可愛。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "草莓馬卡龍",
      slug: "strawberry-macaron",
      description: "經典草莓風味，香氣甜美。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-nonik-yench-3589897-5720907.jpg?alt=media&token=4c2c733e-be00-4433-9c53-175550274d74",
      categoryId: macarons.id,
      subcategoryId: subFruitMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、草莓果泥、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile: "使用新鮮草莓泥製成內餡，酸甜平衡，果香自然。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "椰香馬卡龍",
      slug: "coconut-macaron",
      description: "香甜椰奶風味，異國風情。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-mariah-green-3624629-5423254.jpg?alt=media&token=2b93ba96-ce6f-48de-b049-c214ede80406",
      categoryId: macarons.id,
      subcategoryId: subFruitMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、椰奶、椰絲、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile: "椰奶與椰絲交織出柔滑甜香，熱帶風味濃厚。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "萊姆薄荷馬卡龍",
      slug: "lime-mint-macaron",
      description: "微酸萊姆與清涼薄荷的清爽組合。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-valeriya-8625945.jpg?alt=media&token=0106ae2f-74e2-4769-b607-f6dfb564f737",
      categoryId: macarons.id,
      subcategoryId: subFruitMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、萊姆汁、薄荷葉、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile: "清新酸甜、尾韻帶薄荷涼感，夏季限定的消暑口味。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "藍莓馬卡龍",
      slug: "blueberry-macaron",
      description: "深藍莓果香濃郁，微酸甜味平衡。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-valeriya-7474246.jpg?alt=media&token=54bc363e-99b4-48a5-9cac-b7359513534a",
      categoryId: macarons.id,
      subcategoryId: subFruitMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、藍莓泥、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile: "藍莓果香濃郁，甜中帶酸，整體香氣清爽層次豐富。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "70%巧克力馬卡龍",
      slug: "dark-chocolate-macaron",
      description: "濃郁可可風味、微苦中帶甜。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-mohaned-tamzini-686673207-28144834.jpg?alt=media&token=30f77358-0b6c-4de7-9867-242bd1f0b15d",
      categoryId: macarons.id,
      subcategoryId: subClassicMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、黑巧克力、鮮奶油",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile: "使用70%比利時黑巧克力製成內餡，苦甜平衡、香氣厚實。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 190, isDefault: true },
          { variantName: "6入組", price: 360 },
          { variantName: "12入禮盒", price: 680 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "焦糖巧克力馬卡龍",
      slug: "caramel-choco-macaron",
      description: "焦糖香氣與可可融合的柔滑甜點。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-nietjuhart-30173364%20(1).jpg?alt=media&token=38817522-e264-4594-8a3e-7a373b089cdb",
      categoryId: macarons.id,
      subcategoryId: subClassicMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、焦糖醬、黑巧克力、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile: "濃郁巧克力與焦糖交織的香氣豐富、口感滑順甜中帶苦。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 190, isDefault: true },
          { variantName: "6入組", price: 360 },
          { variantName: "12入禮盒", price: 680 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "經典香草馬卡龍",
      slug: "vanilla-macaron",
      description: "純淨香草香氣，最原始的法式風味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-roman-odintsov-6798407.jpg?alt=media&token=7a7d6932-4680-4cac-afdb-c6bc1ae951f9",
      categoryId: macarons.id,
      subcategoryId: subClassicMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、香草豆莢、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "使用天然香草豆莢製作，甜度柔和、香氣高雅，是最經典的法式風味。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "深焙咖啡馬卡龍",
      slug: "coffee-macaron",
      description: "濃厚咖啡香氣、苦甜平衡。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-nietjuhart-29716034.jpg?alt=media&token=44350c54-2a5f-463d-90a3-087bcca12772",
      categoryId: macarons.id,
      subcategoryId: subClassicMacarons.id,
      ingredients: "杏仁粉、糖粉、蛋白、深焙咖啡粉、奶油霜",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "使用深焙咖啡豆製成咖啡醬，苦香濃郁、尾韻滑順，是大人味首選。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 180, isDefault: true },
          { variantName: "6入組", price: 340 },
          { variantName: "12入禮盒", price: 640 },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "提拉米蘇馬卡龍",
      slug: "tiramisu-macaron",
      description: "融合可可與咖啡的經典義式風味。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-nishant-sharma-77755298-10249463.jpg?alt=media&token=6dc76964-8882-450f-b3ca-f5cfeb1d095c",
      categoryId: macarons.id,
      subcategoryId: subClassicMacarons.id,
      isHot: true,
      ingredients: "杏仁粉、糖粉、蛋白、馬斯卡彭乳酪、咖啡液、可可粉",
      shelfLife: "冷藏保存3天，冷凍保存7天",
      flavorProfile:
        "以馬斯卡彭乳酪與咖啡製作內餡，濃郁滑順，甜度平衡，是人氣經典款。",
      productvariant: {
        create: [
          { variantName: "3入組", price: 190, isDefault: true },
          { variantName: "6入組", price: 360 },
          { variantName: "12入禮盒", price: 680 },
        ],
      },
    },
  });

  // 建立首頁 Banner
  console.log("Creating banners...");

  await prisma.banners.createMany({
    data: [
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fbanner%2Fb4.jpg?alt=media&token=61e2e3ff-2028-48e2-94b2-788ef1ef2452",
        title: "濃醇登場・生巧克力系列",
        buttonText: "探索更多",
        buttonLink: "/products/classic-cakes/chocolate-cakes",
        fontColor: "light",
      },
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fbanner%2Fb2.jpg?alt=media&token=14c41356-4b11-4ff5-9ab1-63c3982f5b50",
        title: "繽紛馬卡龍・法式下午茶首選",
        buttonText: "前往選購",
        buttonLink: "/products/macarons/tea-macarons",
        fontColor: "dark",
      },
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fbanner%2Fb3.jpg?alt=media&token=7a129591-a0d2-42f5-9b36-807621f167dc",
        title: "週末野餐甜點盒・幸福出發",
        buttonText: "立即訂購",
        buttonLink: "/products/cookies/soft-cookies",
        fontColor: "dark",
      },
      {
        image:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fbanner%2Fb5.jpg?alt=media&token=592d5d47-7b8e-4655-90db-90862990ee9f",
        title: "香氣綻放・生乳酪蛋糕",
        buttonText: "看更多口味",
        buttonLink: "/products/classic-cakes/baked-cheesecake",
        fontColor: "light",
      },
    ],
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
        image:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fnews%2Fpexels-george-dolgikh-551816-2072171.jpg?alt=media&token=9cac337b-160a-4f04-b860-9346526dcb76",
      },
      {
        title: "情人節送禮首選生巧克力禮盒",
        content:
          "香濃手工生巧克力，最適合在2月與心愛的人分享。限量禮盒，2月初正式開賣！",
        date: new Date("2024-02-01"),
        image:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fnews%2Fpexels-goumbik-352782.jpg?alt=media&token=a5d437e2-5ab1-411d-8fa7-b85655b2c4b3",
      },
      {
        title: "仲夏綠葡萄千層新上市！",
        content:
          "盛夏限定甜點—清爽的綠葡萄千層蛋糕，酸甜滋味絕對讓你難忘！3月起於全門市供應。",
        date: new Date("2024-03-01"),
        image:
          "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fnews%2Fpexels-karolina-grabowska-4996964.jpg?alt=media&token=24e6ddeb-3d48-4218-a298-8325c4ac6ef7",
      },
    ],
  });

  // 折扣碼
  console.log("Creating discount codes...");
  await prisma.discount_code.createMany({
    data: [
      {
        code: "WELCOME100",
        type: "fixed", // 固定折抵
        value: 100,
        isActive: true,
        expiresAt: new Date("2025-12-31"),
      },
      {
        code: "SALE10",
        type: "percent", // 打折
        value: 10, // 代表 10%
        isActive: true,
        expiresAt: new Date("2025-06-30"),
      },
    ],
  });

  // --- 加價購商品 ---
  console.log("Creating addon products...");

  await prisma.product.create({
    data: {
      name: "禮盒包裝",
      slug: "addon-gift-box",
      categoryId: macarons.id, // 可放任意一個現有分類
      subcategoryId: subClassicMacarons.id, // 同樣屬於現有子分類
      description: "精美禮盒包裝，適合送禮。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-chwastek-83016-256040.jpg?alt=media&token=975f75d7-73b0-4647-92e0-cf116fdc6eb9",
      isAddon: true,
      isVisible: false,
      isHot: false,
      status: true,
      productvariant: {
        create: [
          {
            variantName: "基本款",
            price: 85,
            isDefault: true,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "品牌手提袋",
      slug: "addon-bag",
      categoryId: macarons.id,
      subcategoryId: subClassicMacarons.id,
      description: "環保紙提袋，搭配甜點更體面。",
      heroImage:
        "https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fproducts%2Fpexels-angela-roma-7319110.jpg?alt=media&token=c99f7fc0-9135-4761-a68f-f362aa3a8b4f",
      isAddon: true,
      isVisible: false,
      isHot: false,
      status: true,
      productvariant: {
        create: [
          {
            variantName: "基本款",
            price: 25,
            isDefault: true,
          },
        ],
      },
    },
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
