<template>
  <section class="py-20 bg-white hot-products">
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
        320: { slidesPerView: 2, spaceBetween: 10 },
        768: { slidesPerView: 4, spaceBetween: 10 }
      }"
      class="relative px-4 md:px-8 overflow-visible"
    >
      <SwiperSlide v-for="item in hotProducts" :key="item.id">
        <ProductCard :product="item" />
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
import ProductCard from "../ProductCard.vue";

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
/* --- 外層容器設定 --- */
.hot-products {
  position: relative; /* 讓箭頭能絕對定位 */
}

/* --- Swiper Slide 對齊 --- */
:deep(.swiper-slide) {
  display: flex;
  justify-content: center;
}

/* --- 桌機 / 平板：箭頭設定 --- */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;

  width: 40px;
  height: 40px;
  color: var(--color-primary);
  background: rgba(245, 158, 110, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}



/* --- 滑過樣式 --- */
:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  background: var(--color-primary);
  color: var(--color-primary-foreground);
}

/* --- 小螢幕 (<768px)：隱藏箭頭 --- */
@media (max-width: 767px) {
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    display: none !important;
  }
}
</style>
