<template>
  <div
    class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10"
  >
    <!-- 左側圖片 -->
    <div
      v-if="!product.heroImage"
      class="w-full h-64 bg-muted animate-pulse rounded"
    ></div>

    <ImageZoom
      v-if="product.heroImage"
      :src="product.heroImage"
      :alt="product.name"
    />

    <!-- 右側商品資訊 -->
    <div>
      <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
      <p class="text-muted-foreground mb-4">{{ product.description }}</p>

      <!-- 規格選擇 -->
      <div v-if="product.productvariants?.length > 1" class="mb-4 flex gap-3">
        <button
          v-for="variant in product.productvariants"
          :key="variant.id"
          @click="selectVariant(variant)"
          class="px-4 py-2 rounded-full border transition"
          :class="variant.id === selectedVariant?.id
            ? 'border-primary bg-primary text-white'
            : 'border-gray-300 bg-white text-foreground hover:bg-muted'"
        >
          {{ variant.variantName }}
        </button>
      </div>

      <!-- 價格 -->
      <p class="text-2xl font-semibold mb-6">
        NT$ {{ selectedVariant?.price }}
      </p>

      <!-- 數量 + 購物車 -->
      <div class="flex items-center gap-3 mb-6">
        <button class="btn-outline rounded-full w-10 h-10" @click="decreaseQty">
          -
        </button>
        <span class="text-lg font-medium">{{ quantity }}</span>
        <button class="btn-outline rounded-full w-10 h-10" @click="increaseQty">
          +
        </button>

        <button class="btn btn-primary ml-6">加入購物車</button>
        <button class="btn btn-secondary">立即購買</button>
      </div>

      <!-- 注意事項 -->
      <div class="bg-accent p-4 rounded mb-6 text-sm text-muted-foreground">
        產品出貨後除非產品本身重大瑕疵，概不接受退換貨，且不適用七日鑑賞期。
      </div>

      <!-- 展開收合資訊 -->
      <div class="divide-y border rounded">
        <details class="p-4">
          <summary class="font-semibold cursor-pointer">製造成份</summary>
          <p class="mt-2">{{ product.ingredients }}</p>
        </details>
        <details class="p-4">
          <summary class="font-semibold cursor-pointer">保存期限</summary>
          <p class="mt-2">{{ product.shelfLife }}</p>
        </details>
        <details class="p-4">
          <summary class="font-semibold cursor-pointer">產品風味</summary>
          <p class="mt-2">{{ product.flavorProfile }}</p>
        </details>
        <details class="p-4">
          <summary class="font-semibold cursor-pointer">宅配說明</summary>
          <p class="mt-2">本產品可宅配全台，部分偏遠地區運送時間可能延長。</p>
        </details>
      </div>
    </div>
  </div>

  <!-- 你可能也會喜歡 -->
  <div class="max-w-7xl mx-auto px-4 py-12">
    <h2 class="text-2xl font-bold mb-6">你可能也會喜歡</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in recommendations"
        :key="item.id"
        class="border rounded-lg p-4 shadow hover:shadow-lg transition"
      >
        <img
          :src="item.heroImage"
          :alt="item.name"
          class="w-full h-48 object-cover rounded mb-3"
          loading="lazy"
        />
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <p class="text-sm text-muted-foreground mb-2">
          {{ item.description }}
        </p>
        <p class="font-bold">
          NT$ {{ item.productvariants?.[0]?.price ?? "—" }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ImageZoom from "../components/ImageZoom.vue";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const slug = route.params.slug;

const product = ref({});
const selectedVariant = ref(null);
const quantity = ref(1);
const recommendations = ref([]);

onMounted(async () => {
  // 單品
   const res = await fetch(`${API_URL}/api/products/detail/${slug}`);
  const data = await res.json();
  product.value = data;

  if (product.value?.productvariants?.length) {
    selectedVariant.value =
      product.value.productvariants.find((v) => v.isDefault) ||
      product.value.productvariants[0];
  }


  // 隨機推薦三個
 const allRes = await fetch(`${API_URL}/api/allproducts`);
  const allData = await allRes.json();

  let allProducts = Array.isArray(allData) ? allData : [];
  allProducts = allProducts.filter((p) => p.slug !== slug);

  recommendations.value = allProducts.sort(() => 0.5 - Math.random()).slice(0, 3);

  console.log("product =", product.value);
  console.log("recommendations =", recommendations.value);
});


function selectVariant(variant) {
  selectedVariant.value = variant;
}
function increaseQty() {
  quantity.value++;
}
function decreaseQty() {
  if (quantity.value > 1) quantity.value--;
}
</script>
