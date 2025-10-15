<template>
  <div class="bg-white shadow rounded-lg p-6 space-y-6">
    <h2 class="text-xl font-semibold">加購專區</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div
        v-for="addon in addons"
        :key="addon.id"
        class="border rounded p-4 flex flex-col items-center"
      >
        <img
          :src="addon.heroImage"
          class="w-24 h-24 object-cover mb-2 rounded"
        />
        <p class="font-medium">{{ addon.name }}</p>
        <p class="text-gray-600">
          NT$ {{ addon.productvariant?.[0]?.price || '-' }}
        </p>
        <button @click="addAddonToCart(addon)" class="btn btn-secondary mt-3">
          加入購物車
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import { useCartStore } from "../../stores/cartStore";

const addons = ref([]);
const cart = useCartStore();

// 取得加價購清單
onMounted(async () => {
  try {
    const res = await api.get("/products?isAddon=true");
    addons.value = res.data;
  } catch (err) {
    console.error("載入加價購資料失敗：", err);
  }
});

// 加入購物車（呼叫後端 /cart/addon）
async function addAddonToCart(addon) {
  try {
       const variantId = addon.productvariant?.[0]?.id;
    if (!variantId) throw new Error("找不到加價購商品的 variant");
    await cart.addToCart(variantId, 1);
  } catch (err) {
    console.error("加入加價購失敗：", err);
  }
}
</script>
