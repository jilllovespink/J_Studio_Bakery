<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header 共用 -->
    <Header />

    <!-- 主要內容 -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer 共用 -->
    <!-- <Footer /> -->
  </div>
</template>

<script setup>
import Header from "../components/Header.vue"
// import Footer from "@/components/Footer.vue" // 如果還沒做，可以暫時移除
</script>
