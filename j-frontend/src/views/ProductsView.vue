<template>
  <div class="flex flex-col md:flex-row bg-background">
    <!-- Sidebar 左邊 20% -->
    <aside
      class="w-full md:w-1/5 p-4 md:p-6 border-b md:border-b-0 md:border-r border-[var(--color-border)]
             md:sticky md:top-0 md:h-screen md:overflow-y-auto"
    >
      <h1 class="text-2xl font-bold mb-2 md:mb-4">甜點系列</h1>
      <div class="w-24 h-1 bg-primary rounded mb-6 md:mb-4"></div>

      <!-- 桌面版直向列表 / 手機版橫向捲動 -->
      <ul
        class="flex md:flex-col gap-4 md:gap-6 overflow-x-auto md:overflow-visible whitespace-nowrap"
      >
        <li
          v-for="cat in categories"
          :key="cat.id"
          class="flex-shrink-0 md:flex-shrink w-auto"
        >
          <!-- 大分類 -->
          <RouterLink
            :to="`/products/${cat.slug}`"
            class="block font-bold text-base md:text-lg px-3 py-2 rounded-lg transition-colors"
            :class="{
                'bg-primary text-primary-foreground':
                  activeCategory?.slug === cat.slug,
                'hover:text-primary': activeCategory?.slug !== cat.slug,
              }"
          >
            {{ cat.name }}
          </RouterLink>

          <!-- 子分類 -->
          <ul class="ml-4 mt-2 space-y-1 hidden md:block">
            <li v-for="sub in cat.subcategories" :key="sub.id">
              <RouterLink
                :to="{ path: `/products/${cat.slug}`, hash: `#${sub.slug}` }"
                class="block text-sm px-2 py-1 rounded-md transition-colors"
                :class="{
                    'text-primary font-semibold':
                      route.hash === `#${sub.slug}`,
                    'text-muted-foreground hover:text-primary':
                      route.hash !== `#${sub.slug}`,
                  }"
              >
                {{ sub.name }}
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- 右邊內容 80% -->
    <main class="w-full md:w-4/5 p-4 md:p-6">
      <!-- Banner -->
      <div
        v-if="activeCategory"
        class="mb-8 md:mb-12 p-6 rounded-lg text-center"
        style="background: linear-gradient(to right, var(--color-primary), var(--color-secondary));"
      >
        <h2 class="text-xl md:text-2xl font-bold text-white mb-2">
          {{ activeCategory.name }}
        </h2>
        <p class="text-white text-sm md:text-base">
          {{ activeCategory.description }}
        </p>
      </div>

      <!-- 子分類區塊 -->
      <div
        v-for="sub in activeSubcategories"
        :key="sub.id"
        :id="sub.slug"
        class="mb-12 md:mb-16"
      >
        <!-- 子分類標題帶線條 -->
        <div class="flex items-center mb-4 md:mb-6">
          <div class="flex-1 border-t border-[var(--color-border)]"></div>
          <h3 class="mx-3 md:mx-4 text-lg md:text-xl font-semibold">
            {{ sub.name }}
          </h3>
          <div class="flex-1 border-t border-[var(--color-border)]"></div>
        </div>

        <!-- 商品卡片：1/2/3 欄 -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <ProductCard
            v-for="p in productsBySub[sub.id]"
            :key="p.id"
            :product="p"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import ProductCard from "../components/ProductCard.vue";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();

const categories = ref([]);
const activeCategory = ref(null);
const activeSubcategories = ref([]);
const productsBySub = ref({});

// 抓分類 + 子分類
const fetchCategories = async () => {
  console.log("Fetching categories...");
  const res = await fetch(`${API_URL}/api/categories`);
  const data = await res.json();

  for (const cat of data) {
    const subRes = await fetch(`${API_URL}/api/categories/${cat.id}/subcategories`);
    cat.subcategories = await subRes.json();
  }

data.unshift({
    id: "hot", // 不會跟 DB id 重複就好
    name: "暢銷 TOP10",
    slug: "top10",
    description: "人氣熱銷商品，一次看完！",
    subcategories: [
      { id: "hot-sub", slug: "hot", name: "熱門商品" },
    ],
  });

  console.log("Fetched categories:", data);
  categories.value = data;
};

// 初始化 / 切換分類
const initActiveCategory = async () => {
  const slug = route.params.categorySlug;
  if (!slug) return;

  // 虛擬分類：暢銷 TOP10
  if (slug === "top10") {
    activeCategory.value = {
      name: "暢銷 TOP10",
      description: "人氣熱銷商品，一次看完！",
      slug: "top10",
    };

    activeSubcategories.value = [
      { id: "hot", slug: "hot", name: "熱門商品" },
    ];

    const res = await fetch(`${API_URL}/api/products/hot`);
    const hotProducts = await res.json();

    productsBySub.value = { hot: hotProducts };
    return;
  }

  // 一般分類
  activeCategory.value = categories.value.find((c) => c.slug === slug);
  activeSubcategories.value = activeCategory.value?.subcategories || [];

  productsBySub.value = {};
  for (const sub of activeSubcategories.value) {
    const res = await fetch(`${API_URL}/api/subcategories/${sub.id}/products`);
    productsBySub.value[sub.id] = await res.json();
  }

  // hash 捲動
  if (route.hash) {
    await nextTick();
    const el = document.querySelector(route.hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
};

watch(
  () => [route.params.categorySlug, categories.value],
  initActiveCategory,
  { immediate: true }
);

onMounted(fetchCategories);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
