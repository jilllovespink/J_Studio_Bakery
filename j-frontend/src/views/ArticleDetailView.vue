<template>
  <div class="bg-background min-h-screen py-10">
    <div class="max-w-5xl mx-auto px-4">
      <!-- 文章標題與資訊 -->
      <header v-if="article" class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">
          {{ article.title }}
        </h1>

        <div
          class="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap"
        >
          <span>娟姐</span>
          <span class="flex items-center gap-1">
            <i class="fa-regular fa-calendar"></i>
            {{ formatDate(article.publishedAt) }}
          </span>
          <span v-if="article.category" class="flex items-center gap-1">
            <i class="fa-solid fa-bookmark"></i>
            {{ article.category.name }}
          </span>
          <span v-if="article.subcategory"
            >｜　{{ article.subcategory.name }}</span
          >
        </div>

        <div
          v-if="article.coverImageUrl"
          class="rounded-2xl overflow-hidden mb-6 h-[280px] md:h-[320px]"
        >
          <LazyImage
            :src="article.coverImageUrl"
            :alt="article.title"
            class="w-full h-auto object-cover"
          />
        </div>
      </header>
      <!-- 文章目錄 -->
      <ArticleToc v-if="toc.length" :toc="toc" :offset="100" />

      <!-- 文章內容 -->
      <article
        v-if="article"
        v-html="article.content"
        class="article-content max-w-none text-foreground"
      ></article>

      <!-- 作者介紹 -->
      <section
        v-if="article"
        class="bg-white rounded-2xl shadow p-6 mt-16 mb-10 flex items-center gap-6 border border-[var(--color-border)]"
      >
        <div
          class="w-16 h-16 flex items-center justify-center rounded-full bg-primary/20 text-primary text-2xl"
        >
          <i class="fa-solid fa-user"></i>
        </div>
        <div>
          <h3 class="font-semibold text-lg text-foreground mb-1">關於 娟姐</h3>
          <p class="text-muted-foreground text-base leading-relaxed">
            娟姐擁有超過十年的專業烘焙經驗，專精於法式甜點製作。她致力於分享烘焙技巧與創作心得，
            希望幫助更多人享受烘焙的樂趣。
          </p>
        </div>
      </section>

      <!-- 相關文章 -->
      <section v-if="relatedArticles.length">
        <h2 class="text-2xl font-bold mb-6">相關文章推薦</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <ArticleCard
            v-for="item in relatedArticles"
            :key="item.id"
            :article="item"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import ArticleToc from "../components/Article/ArticleToc.vue";
import ArticleCard from "../components/ArticleCard.vue";
import LazyImage from "../components/LazyImage.vue";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();

const article = ref(null);
const relatedArticles = ref([]);
const toc = ref([]);

// 格式化日期函式（只取前10碼）
const formatDate = (dateString) => {
  return dateString ? dateString.slice(0, 10) : "";
};

// 抓取單篇文章資料
const fetchArticle = async () => {
  try {
    const res = await fetch(`${API_URL}/api/articles/${route.params.slug}`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    article.value = await res.json();

    // 生成目錄
    nextTick(() => {
      toc.value = [...document.querySelectorAll("article h2, article h3")].map(
        (el) => ({
          id: (el.id ||= el.textContent.trim().replace(/\s+/g, "-")),
          text: el.textContent.trim(),
          level: el.tagName === "H3" ? 3 : 2,
        })
      );
    });

    // 抓同分類的其他文章
    if (article.value?.categoryId) fetchRelatedArticles(article.value.categoryId);
  } catch (err) {
    console.error("載入文章失敗:", err);
  }
};

// 抓取相關文章（同分類底下隨機三篇）
const fetchRelatedArticles = async (catId) => {
  try {
    const res = await fetch(`${API_URL}/api/articles/by-category/${catId}`);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const data = await res.json();
    relatedArticles.value = data
      .filter((a) => a.slug !== route.params.slug)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  } catch (err) {
    console.error("載入相關文章失敗:", err);
  }
};

onMounted(fetchArticle);
</script>
