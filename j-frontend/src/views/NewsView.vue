<template>
  <div class="flex flex-col bg-background min-h-screen">
    <!-- 頁面標題區 -->
    <section
      class="w-full text-center p-8 md:p-12 mb-8 md:mb-12"
      style="background: linear-gradient(to right, var(--color-primary), var(--color-secondary));"
    >
      <h1 class="text-2xl md:text-3xl font-bold text-white mb-2">最新消息</h1>
      <p class="text-white/90 text-sm md:text-base">
        瞭解甜點工坊的最新活動、限定商品與公告。
      </p>
    </section>

    <!-- 卡片列表 -->
    <main class="max-w-6xl mx-auto w-full p-4 md:p-6">
      <div
        v-if="newsList.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <NewsCard v-for="item in newsList" :key="item.id" :item="item" />
      </div>

      <div v-else class="text-center text-muted-foreground py-20">
        目前暫無最新消息。
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NewsCard from "../components/NewsCard.vue";

const API_URL = import.meta.env.VITE_API_URL;
const newsList = ref([]);

// 抓取最新消息資料
const fetchNews = async () => {
  try {
    const res = await fetch(`${API_URL}/api/news`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    newsList.value = await res.json(); // ✅ 後端已排序，不需前端再 sort()
  } catch (err) {
    console.error("載入最新消息失敗:", err);
  }
};

onMounted(fetchNews);
</script>
