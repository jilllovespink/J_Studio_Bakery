<template>
  <div>
    <!-- Hero 區塊 -->
    <HeroBanner />
    <HotProducts />
    <NewsSection />
  </div>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-primary">首頁</h1>
    <p>這是 Vue Router 測試頁面</p>
  </div>
</template>
<script setup>
import HeroBanner from "../components/HomePage/HeroBanner.vue";
import HotProducts from "../components/HomePage/HotProducts.vue";
import NewsSection from "../components/HomePage/NewsSection.vue";
</script>
