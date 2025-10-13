<template>
  <div class="bg-background min-h-screen py-10">
    <div class="max-w-4xl mx-auto px-4">
      <div v-if="news">
        <!-- 標題與日期 -->
        <header v-if="news" class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            {{ news.title }}
          </h1>
          <div class="flex items-center text-muted-foreground text-sm gap-2">
            <i class="fa-regular fa-calendar text-primary"></i>
            <span>{{ formatDate(news.date) }}</span>
          </div>
        </header>

        <!-- 封面圖片 -->
        <div
          v-if="news.image"
          class="rounded-2xl overflow-hidden mb-6 h-[240px] md:h-[300px]"
        >
          <LazyImage
            :src="news.image"
            :alt="news.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- 內容 -->
        <article
          v-if="news"
          class="prose max-w-none text-foreground leading-relaxed"
        >
          {{ news.content }}
        </article>

        <!-- 返回按鈕 -->
        <div class="mt-10">
          <RouterLink
            to="/news"
            class="inline-block px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition"
          >
            ← 返回最新消息
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import LazyImage from "../components/LazyImage.vue";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const news = ref(null);

// 日期格式化
const formatDate = (date) => {
  return date ? new Date(date).toISOString().slice(0, 10) : "";
};

// 抓取單篇新聞
const fetchNewsDetail = async () => {
  try {
    const res = await fetch(`${API_URL}/api/news/${route.params.id}`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    news.value = await res.json();
  } catch (err) {
    console.error("載入最新消息失敗:", err);
  }
};

onMounted(fetchNewsDetail);
</script>
