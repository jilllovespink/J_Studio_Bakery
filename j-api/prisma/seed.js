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
  await prisma.articleSubCategory?.deleteMany().catch(() => {});
  await prisma.articleCategory?.deleteMany().catch(() => {});

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
      name: "食材比一比",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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
        coverImageUrl: "",
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

  // 加價購商品
  console.log("Creating addon products...");
  await prisma.addon_product.createMany({
    data: [
      {
        name: "品牌紙袋",
        price: 5.0,
        imageUrl: "/images/addons/bag.jpg",
        status: true,
      },
      {
        name: "精裝木盒",
        price: 199.0,
        imageUrl: "/images/addons/woodbox.jpg",
        status: true,
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
