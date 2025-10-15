<template>
  <section class="py-16 bg-background">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold">最新消息</h2>
      <p class="text-muted-foreground mt-2">掌握最新的甜點資訊與烘焙活動</p>
    </div>

    <div class="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
      <NewsCard v-for="n in news" :key="n.id" :item="n" />
    </div>

    <div class="text-center mt-10">
      <a href="/news" class="btn btn-outline">查看所有消息</a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NewsCard from "../NewsCard.vue";

const API_URL = import.meta.env.VITE_API_URL;
const news = ref([]);

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/news`);
    news.value = await res.json();
  } catch (err) {
    console.error("Failed to fetch news", err);
  }
});
</script>
