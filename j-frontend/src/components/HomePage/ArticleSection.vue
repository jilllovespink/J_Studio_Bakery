<template>
  <section class="py-16 bg-white">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold">精選文章</h2>
      <p class="text-muted-foreground mt-2">娟姐獨家食譜、烘焙技巧不藏私分享</p>
    </div>

    <div class="grid gap-6 md:grid-cols-3 max-w-7xl mx-auto">
      <ArticleCard v-for="n in latestArticles" :key="n.id" :article="n" />
    </div>

    <div class="text-center mt-10">
      <a href="/articles" class="btn btn-outline">瀏覽所有文章</a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import ArticleCard from "../ArticleCard.vue";

const API_URL = import.meta.env.VITE_API_URL;
const articles = ref([]);

const latestArticles = computed(() =>
  [...articles.value]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 3)
);

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/articles/latest`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    articles.value = await res.json();
  } catch (err) {
    console.error("載入文章失敗：", err);
  }
});
</script>
