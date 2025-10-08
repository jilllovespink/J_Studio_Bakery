<template>
  <CategoryPage
    title="甜點系列"
    basePath="/products"
    categoryApi="/api/categories"
    subcategoryApi="/api/subcategories"
    itemApi="products"
    :cardComponent="ProductCard"
    itemProp="product"
    hotCategory
    hotApi="/api/products/hot"
  />
</template>
<script setup>
import CategoryPage from "../components/CategoryPage.vue";
import ProductCard from "../components/ProductCard.vue";
</script>
