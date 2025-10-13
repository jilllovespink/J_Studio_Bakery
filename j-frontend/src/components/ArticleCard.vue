<template>
  <div
    class="group bg-white rounded-2xl shadow p-6 flex flex-col transition-all duration-300 hover:shadow-xl"
  >
    <!-- 類別 -->
    <div class="flex items-center text-sm text-muted-foreground mb-3">
      <span class="mr-2 text-primary font-medium">
        {{ article.category?.name || "未分類" }}
      </span>
      <span>/</span>
      <span class="ml-2">
        {{ article.subcategory?.name || "未分類" }}
      </span>
    </div>

    <!-- 標題 -->
    <h3 class="font-bold text-lg mb-3">{{ article.title }}</h3>

    <!-- 封面圖片 -->
    <div
      v-if="article.coverImageUrl"
      class="w-full h-40 rounded-lg overflow-hidden mb-3"
    >
      <LazyImage
        :src="article.coverImageUrl"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- 摘要 -->
    <p class="text-muted-foreground line-clamp-3 flex-1">
      {{ article.excerpt }}
    </p>

    <!-- 閱讀更多 -->
    <RouterLink
      :to="{ name: 'articleDetail', params: { slug: article.slug } }"
      class="mt-4 text-primary font-medium hover:underline"
    >
      閱讀更多 →
    </RouterLink>
  </div>
</template>

<script setup>
import LazyImage from "./LazyImage.vue";

const props = defineProps({
  article: { type: Object, required: true }
});
</script>
