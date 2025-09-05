<template>
  <section class="py-16 bg-background">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold">人氣甜點</h2>
      <p class="text-muted-foreground mt-2">
        精選最受歡迎的手工甜點，每一口都是用心的呈現
      </p>
    </div>

    <Swiper
      v-if="hotProducts.length > 0"
      :loop="true"
      :modules="[Autoplay, Navigation]"
      :autoplay="{ delay: 3000, disableOnInteraction: false }"
      navigation
      :breakpoints="{
        320: { slidesPerView: 2, spaceBetween: 12 },
        768: { slidesPerView: 4, spaceBetween: 20 }
      }"
      class="max-w-7xl mx-auto overflow-visible"
    >
      <SwiperSlide v-for="item in hotProducts" :key="item.id">
        <div class="flex flex-col items-center">
          <div
            class="w-50 h-50 rounded-full overflow-hidden shadow-lg hover:scale-105 transition"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
          </div>
          <p class="mt-3 text-foreground">{{ item.name }}</p>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- 查看更多按鈕 -->
    <div class="text-center mt-10">
      <a href="/products" class="btn btn-outline">查看所有甜點</a>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


const API_URL = import.meta.env.VITE_API_URL;
const hotProducts = ref([]);

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/products/hot`);
    hotProducts.value = await res.json();
  } catch (err) {
    console.error("Failed to fetch hot products", err);
  }
});
</script>
<style scoped>
:deep(.swiper),
:deep(.swiper-wrapper) {
  overflow: visible !important;
}
/* 桌機 / 平板：箭頭浮在外側 */
:deep(.swiper-button-prev) {
  left: -30px;
}

:deep(.swiper-button-next) {
  right: -30px;
}

/* 箭頭外觀（延續你要的樣式） */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  width: 44px;
  height: 44px;
  color: var(--color-primary);
  background: rgba(245, 158, 110, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

/* 小螢幕 (<768px) 隱藏箭頭 */
@media (max-width: 767px) {
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none !important;
  }
}
</style>
