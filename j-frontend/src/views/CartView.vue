<script setup>
import { onMounted } from "vue";
import { useCartStore } from "@/stores/cartStore";

const cart = useCartStore();

// 載入購物車內容
onMounted(() => {
  cart.fetchCart();
});

const updateQuantity = (variantId, quantity) => {
  cart.updateQuantity(variantId, quantity);
};

const removeItem = (variantId) => {
  cart.removeItem(variantId);
};

const clearCart = () => {
  cart.clearCart();
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">購物車</h1>

    <div v-if="cart.items.length === 0">購物車是空的</div>

    <div v-else>
      <ul class="divide-y">
        <li
          v-for="item in cart.items"
          :key="item.variantId"
          class="flex items-center justify-between py-4"
        >
          <div>
            <p class="font-semibold">{{ item.variantName }}</p>
            <p class="text-gray-600">${{ item.price }} x {{ item.quantity }}</p>
          </div>

          <!-- 數量控制 -->
          <div class="flex items-center gap-2">
            <button
              @click="updateQuantity(item.variantId, item.quantity - 1)"
              class="px-2 py-1 border"
            >
              -
            </button>
            <span>{{ item.quantity }}</span>
            <button
              @click="updateQuantity(item.variantId, item.quantity + 1)"
              class="px-2 py-1 border"
            >
              +
            </button>
          </div>

          <!-- 刪除 -->
          <button @click="removeItem(item.variantId)" class="text-red-500 ml-4">
            移除
          </button>
        </li>
      </ul>

      <div class="mt-6 flex justify-between items-center">
        <h2 class="text-xl font-bold">總金額: ${{ cart.cartTotal }}</h2>
        <button
          @click="clearCart"
          class="bg-red-500 text-white px-4 py-2 rounded"
        >
          清空購物車
        </button>
      </div>
    </div>
  </div>
</template>
