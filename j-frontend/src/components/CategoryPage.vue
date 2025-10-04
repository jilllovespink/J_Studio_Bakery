<template>
  <div class="flex flex-col md:flex-row bg-background">
    <!-- 左邊 Sidebar -->
    <aside
      class="w-full md:w-1/5 p-4 md:p-6 border-b md:border-b-0 md:border-r border-[var(--color-border)]
             md:sticky md:top-0 md:h-screen md:overflow-y-auto"
    >
      <h1 class="text-2xl font-bold mb-2 md:mb-4">{{ title }}</h1>
      <div class="w-24 h-1 bg-primary rounded mb-6 md:mb-4"></div>

      <ul
        class="flex md:flex-col gap-4 md:gap-6 overflow-x-auto md:overflow-visible whitespace-nowrap"
      >
        <li
          v-for="cat in categories"
          :key="cat.id"
          class="flex-shrink-0 md:flex-shrink w-auto"
        >
          <RouterLink
            :to="`${basePath}/${cat.slug}`"
            class="block font-bold text-base md:text-lg px-3 py-2 rounded-lg transition-colors"
            :class="{
              'bg-primary text-primary-foreground': activeCategory?.slug === cat.slug,
              'hover:text-primary': activeCategory?.slug !== cat.slug,
            }"
          >
            {{ cat.name }}
          </RouterLink>

          <ul class="ml-4 mt-2 space-y-1 hidden md:block">
            <li v-for="sub in cat.subcategories" :key="sub.id">
              <RouterLink
                :to="{ path: `${basePath}/${cat.slug}`, hash: `#${sub.slug}` }"
                class="block text-sm px-2 py-1 rounded-md transition-colors"
                :class="{
                  'text-primary font-semibold': route.hash === `#${sub.slug}`,
                  'text-muted-foreground hover:text-primary': route.hash !== `#${sub.slug}`,
                }"
              >
                {{ sub.name }}
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- 右邊內容 -->
    <main class="w-full md:w-4/5 p-4 md:p-6">
      <div
        v-if="activeCategory"
        class="mb-8 md:mb-12 p-6 rounded-lg text-center"
        style="background: linear-gradient(to right, var(--color-primary), var(--color-secondary));"
      >
        <h2 class="text-xl md:text-2xl font-bold text-white mb-2">
          {{ activeCategory.name }}
        </h2>
        <p class="text-white text-sm md:text-base">
          {{ activeCategory.description || '' }}
        </p>
      </div>

      <div
        v-for="sub in activeSubcategories"
        :key="sub.id"
        :id="sub.slug"
        class="mb-12 md:mb-16"
      >
        <div class="flex items-center mb-4 md:mb-6">
          <div class="flex-1 border-t border-[var(--color-border)]"></div>
          <h3 class="mx-3 md:mx-4 text-lg md:text-xl font-semibold">
            {{ sub.name }}
          </h3>
          <div class="flex-1 border-t border-[var(--color-border)]"></div>
        </div>

        <!-- 動態卡片 -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <component
            :is="cardComponent"
            v-for="item in itemsBySub[sub.id]"
            :key="item.id"
            :[itemProp]="item"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { smoothScrollTo } from "../composables/useSmoothScroll.js";


const props = defineProps({
  title: String,                // 頁面標題
  basePath: String,             // Router 前綴 (/products, /tips)
  categoryApi: String,       // 專門抓分類
  subcategoryApi: String,
  itemApi: { type: String, default: "products" }, // "products" | "articles"
  cardComponent: Object,        // 卡片元件 (ProductCard / ArticleCard)
  hotApi: String,
  stickyOffset: { type: Number, default: 0 },     // sticky header 的高度
  hotCategory: { type: Boolean, default: false } // 是否需要 TOP10 特殊分類
});

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();

const categories = ref([]);
const itemsBySub = ref({});

// 依路由參數與資料，計算出目前的大分類 / 子分類清單
const activeCategory = computed(() => {
  const slug = route.params.categorySlug;
  if (!slug) return null;
  return categories.value.find(c => c.slug === slug) || null;
});

const activeSubcategories = computed(() => activeCategory.value?.subcategories || []);

// 輔助：抓 JSON
const fetchJSON = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${url} ${res.status}`);
  return res.json();
};

// 抓分類
const fetchCategories = async () => {
  const data = await fetchJSON(`${API_URL}${props.categoryApi}`);

    // 逐一填入子分類
  for (const cat of data) {
    const subcategories  = await fetchJSON(`${API_URL}${props.categoryApi}/${cat.id}/subcategories`);
  }

  if (props.hotCategory) {
    data.unshift({
      id: "hot",
      name: "暢銷 TOP10",
      slug: "top10",
      description: "人氣熱銷排行！",
      subcategories: [{ id: "hot-sub", slug: "hot", name: "熱門" }],
    });
  }

  categories.value = data;
};

// 依目前大分類載入每個子分類的 items
const loadItemsForActiveCategory = async () => {
  const slug = route.params.categorySlug;
  if (!slug || !activeCategory.value) return;

    // TOP10 特例
  if (props.hotCategory && slug === "top10") {
    const hotItems = await fetchJSON(`${API_URL}${props.hotApi}`);
    itemsBySub.value = { "hot-sub": hotItems };
  } else {
    const bySub = {};
    for (const sub of activeSubcategories.value) {
      bySub[sub.id] = await fetchJSON(`${API_URL}${props.subcategoryApi}/${sub.id}/${props.itemApi}`);
    }
    itemsBySub.value = bySub;
  }

 // 若網址帶 hash（或切換分類後仍保留 hash），平滑捲動到錨點
  if (route.hash) {
    await smoothScrollTo(route.hash, { offset: props.stickyOffset });
  }
};

// 初次載入
onMounted(async () => {
  await fetchCategories();
  await loadItemsForActiveCategory();
});

// 切換大分類時重新載入子分類 items
watch(() => route.params.categorySlug, async () => {
  await loadItemsForActiveCategory();
});

// 單純切換 hash（點同一大分類下的子分類）時，平滑捲動
watch(() => route.hash, async (hash) => {
  if (!hash) return;
  await smoothScrollTo(hash, { offset: props.stickyOffset });
});
</script>
