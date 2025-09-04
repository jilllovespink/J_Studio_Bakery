<template>
  <section class="relative w-full h-[80vh]">
    <Swiper
      v-if="banners.length > 0"
      :modules="[Autoplay, Pagination, Navigation]"
      :autoplay="{ delay: 5000, disableOnInteraction: false }"
      :loop="true"
      pagination
      navigation
      class="w-full h-full"
    >
      <SwiperSlide v-for="banner in banners" :key="banner.id">
        <div class="relative w-full h-[80vh]">
          <!-- 懶加載圖片 -->
          <LazyImage
            :src="banner.image"
            :alt="banner.title"
            class="absolute inset-0 w-full h-full object-cover"
          />

          <!-- Overlay -->
          <div class="absolute inset-0 bg-white/20"></div>

          <!-- Text + Button -->
          <div
            class="relative z-10 flex flex-col items-center justify-center text-center h-full px-4"
          >
            <h1
              class="text-2xl md:text-4xl lg:text-5xl font-bold mb-4"
              :class="banner.fontColor === 'light' ? 'text-white' : 'text-black'"
            >
              {{ banner.title }}
            </h1>
            <br />
            <br />
            <a :href="banner.buttonLink" class="btn btn-primary">
              {{ banner.buttonText }}
            </a>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- Loading 狀態 -->
    <div v-else class="flex items-center justify-center h-[80vh] text-gray-500">
      Loading banners...
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import LazyImage from "../LazyImage.vue";

const API_URL = import.meta.env.VITE_API_URL;
const banners = ref([]);

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/banners`);
    if (!res.ok) throw new Error("API error");
    banners.value = await res.json();
  } catch (err) {
    console.error("Failed to fetch banners:", err);
  }
});
</script>
