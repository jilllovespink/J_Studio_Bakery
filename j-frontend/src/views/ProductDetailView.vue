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
      class="w-full h-auto rounded-lg"
    />

    <!-- 右側商品資訊 -->
    <div class="flex flex-col">
      <h1 class="text-3xl font-bold mb-2">{{ product.name }}</h1>
      <p class="text-muted-foreground mb-4">{{ product.description }}</p>
      <p v-if="product.flavorProfile" class="text-base text-foreground mb-6">
        {{ product.flavorProfile }}
      </p>

      <!-- 規格選擇 -->
      <div
        v-if="product.productvariants?.length > 1"
        class="mb-4 flex flex-wrap gap-2 md:gap-3"
      >
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
      <div class="flex flex-wrap items-center gap-3 mb-6">
        <button class="btn-outline rounded-full w-10 h-10" @click="decreaseQty">
          -
        </button>
        <span class="text-lg font-medium">{{ quantity }}</span>
        <button class="btn-outline rounded-full w-10 h-10" @click="increaseQty">
          +
        </button>

        <div class="flex gap-2 mt-3 md:mt-0">
          <button class="btn btn-primary ml-6" @click="addToCart">
            加入購物車
          </button>
          <button class="btn btn-secondary">立即購買</button>
        </div>
      </div>

      <!-- 展開收合資訊 -->
      <div class="mt-6">
        <details
          v-for="(section, idx) in detailSections"
          :key="idx"
          class="py-4 border-b border-[var(--color-border)] group"
        >
          <summary
            class="flex justify-between items-center font-semibold cursor-pointer list-none"
          >
            {{ section.title }}
            <span class="text-destructive text-lg">
              <span class="group-open:hidden">+</span>
              <span class="hidden group-open:inline">–</span>
            </span>
          </summary>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ section.content }}
          </p>
        </details>
      </div>

      <!-- 注意事項 -->
      <div
        class="bg-accent p-4 rounded mb-6  mt-8 text-sm text-muted-foreground"
      >
        產品出貨後除非產品本身重大瑕疵，概不接受退換貨，且不適用七日鑑賞期。
      </div>
    </div>
  </div>

  <!-- 你可能也會喜歡 -->
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex items-center mb-6">
      <div class="flex-1 border-t border-[var(--color-border)]"></div>
      <h2 class="mx-3 md:mx-4 text-lg md:text-xl font-semibold">
        你可能也會喜歡
      </h2>
      <div class="flex-1 border-t border-[var(--color-border)]"></div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
      <ProductCard
        v-for="item in recommendations"
        :key="item.id"
        :product="item"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ImageZoom from "../components/ImageZoom.vue";
import ProductCard from "../components/ProductCard.vue";
import { useCartStore } from "../stores/cartStore";
import { usePageMeta } from "../composables/usePageMeta";


const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const slug = route.params.slug;

const product = ref({});
const selectedVariant = ref(null);
const quantity = ref(1);
const recommendations = ref([]);
const detailSections = ref([]);
const cart = useCartStore();

// 綁定 reactive title / description
const title = ref("");
const description = ref("");
usePageMeta({ title, description });


onMounted(async () => {
  // 單品
   const res = await fetch(`${API_URL}/api/products/detail/${slug}`);
  const data = await res.json();
  product.value = data;

  title.value = product.value.name;
  description.value = product.value.description;

  if (product.value?.productvariants?.length) {
    selectedVariant.value =
      product.value.productvariants.find((v) => v.isDefault) ||
      product.value.productvariants[0];
  }

  detailSections.value = [
    { title: "製造成份", content: product.value.ingredients },
    { title: "保存期限", content: product.value.shelfLife },
    {
      title: "宅配說明",
      content: "本產品可宅配全台，部分偏遠地區運送時間可能延長。",
    },
  ];

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

function addToCart() {
  if (!selectedVariant.value) return;
  cart.addToCart(selectedVariant.value.id, quantity.value);
}
</script>
