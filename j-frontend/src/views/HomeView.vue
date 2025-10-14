<template>
  <div>
    <!-- Hero 區塊 -->
    <HeroBanner />
    <HotProducts />
    <NewsSection />
    <ArticleSection />
    <BrandPhilosophy />
  </div>
</template>
<script setup>
import HeroBanner from "../components/HomePage/HeroBanner.vue";
import HotProducts from "../components/HomePage/HotProducts.vue";
import NewsSection from "../components/HomePage/NewsSection.vue";
import ArticleSection from "../components/HomePage/ArticleSection.vue";
import BrandPhilosophy from "../components/HomePage/BrandPhilosophy.vue";
</script>
