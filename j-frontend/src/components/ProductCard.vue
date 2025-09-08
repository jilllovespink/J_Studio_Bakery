<template>
  <a
    class="flex flex-col items-center cursor-pointer group"
    :href="`/products/detail/${product.slug}`"
    target="_blank"
    rel="noopener noreferrer"
  >
    <!-- 商品圖片 -->
    <div
      class="w-55 h-55 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition"
    >
      <img
        :src="product.heroImage"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 商品名稱 -->
    <p
      class="mt-6 font-semibold text-foreground group-hover:text-primary transition"
    >
      {{ product.name }}
    </p>
  </a>
</template>

<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>
