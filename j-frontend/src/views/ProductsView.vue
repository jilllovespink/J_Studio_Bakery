<template>
  <CategoryPage
    title="甜點系列"
    basePath="/products"
    categoryApi="/api/categories"
    subcategoryApi="/api/subcategories"
    hotApi="/api/products/hot"
    :cardComponent="ProductCard"
    itemProp="product"
    hotCategory
  />
</template>
<script setup>
import CategoryPage from "../components/CategoryPage.vue";
import ProductCard from "../components/ProductCard.vue";
</script>
