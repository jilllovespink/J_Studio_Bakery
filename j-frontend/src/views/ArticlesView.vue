<script setup>
import CategoryPage from "../components/CategoryPage.vue";
import ArticleCard from "../components/NewsCard.vue";
</script>

<template>
  <CategoryPage
    title="烘焙秘訣"
    basePath="/tips"
    apiBase="/api/articles"
    :cardComponent="ArticleCard"
    itemProp="article"
  />
</template>
