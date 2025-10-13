<template>
  <div
    class="group bg-white rounded-2xl shadow p-6 flex flex-col transition-all duration-300 hover:shadow-xl"
  >
    <!-- 日期 -->
    <div class="flex items-center text-sm text-muted-foreground mb-3">
      <FontAwesomeIcon icon="fa-solid fa-clock" class="mr-2 text-primary" />
      <span>{{ formatDate(item.date) }}</span>
    </div>

    <!-- 標題 -->
    <h3 class="font-bold text-lg mb-3">{{ item.title }}</h3>

    <!-- 宣傳圖片 -->
    <div class="w-full h-40 rounded-lg overflow-hidden mb-3">
      <LazyImage
        :src="item.image"
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- 內容 (截斷) -->
    <p class="text-muted-foreground line-clamp-3 flex-1">
      {{ item.content }}
    </p>

    <!-- 閱讀更多 -->
    <RouterLink
      :to="`/news/${item.id}`"
      class="mt-4 text-primary font-medium hover:underline self-start"
    >
      閱讀更多 →
    </RouterLink>
  </div>
</template>

<script setup>
import LazyImage from "../components/LazyImage.vue";



const props = defineProps({
  item: { type: Object, required: true }
});

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};
</script>
