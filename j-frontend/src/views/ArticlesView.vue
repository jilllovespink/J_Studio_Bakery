<script setup>
import CategoryPage from "../components/CategoryPage.vue";
import ArticleCard from "../components/ArticleCard.vue";
</script>

<template>
  <CategoryPage
    title="烘焙秘訣"
    basePath="/articles"
    categoryApi="/api/article-categories"
    subcategoryApi="/api/article-subcategories"
    itemApi="articles"
    :cardComponent="ArticleCard"
    itemProp="article"
  />
</template>
