<template>
  <div class="bg-white shadow rounded-lg p-6 space-y-6">
    <h2 class="text-xl font-semibold mb-4">購物清單</h2>

    <!-- 商品列表 -->
    <div
      v-for="item in cart.items"
      :key="item.variantId"
      class="flex items-center justify-between border-b py-4"
    >
      <div class="flex items-center space-x-4">
        <img
          :src="item.productImg"
          alt=""
          class="w-20 h-20 object-cover rounded"
        />
        <div>
          <p class="font-medium">
            {{ item.productName }} - {{ item.variantName }}
          </p>
          <p class="text-sm text-gray-500">NT$ {{ item.price }}</p>
        </div>
      </div>

      <!-- 數量調整 -->
      <div class="flex items-center space-x-2">
        <button
          @click="decrease(item)"
          class="px-3 py-1 border rounded-lg transition-all duration-200 hover:bg-[color:var(--color-primary)] hover:text-white"
        >
          -
        </button>
        <span>{{ item.quantity }}</span>
        <button
          @click="increase(item)"
          class="px-3 py-1 border rounded-lg transition-all duration-200 hover:bg-[color:var(--color-primary)] hover:text-white"
        >
          +
        </button>
      </div>

      <!-- 小計 -->
      <p class="font-semibold">NT$ {{ item.price * item.quantity }}</p>

      <!-- 移除 -->
      <button
        @click="remove(item)"
        class="text-[color:var(--color-destructive)] transition-all duration-200 hover:text-white hover:bg-[color:var(--color-destructive)] hover:shadow px-3 py-1 rounded-lg"
      >
        刪除
      </button>
    </div>

    <!-- 折扣碼 -->
    <div class="flex items-center space-x-2">
      <input
        v-model="discountCode"
        type="text"
        placeholder="輸入折扣碼"
        class="border rounded px-3 py-2 flex-1"
      />
      <button @click="applyDiscount" class="btn btn-primary">套用</button>
    </div>

    <p v-if="cart.summary?.discountAmount > 0" class="text-green-600">
      已套用折扣：-NT$ {{ cart.summary.discountAmount }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "../../stores/cartStore";
import { storeToRefs } from "pinia";

const cart = useCartStore();
const discountCode = ref("");

const { items, summary } = storeToRefs(cart);

onMounted(() => {
  cart.fetchCart();
});

function increase(item) {
  cart.updateQuantity(item.variantId, item.quantity + 1);
}
function decrease(item) {
  if (item.quantity > 1) cart.updateQuantity(item.variantId, item.quantity - 1);
}
function remove(item) {
  cart.removeItem(item.variantId);
}
function applyDiscount() {
  cart.applyDiscount(discountCode.value);
}
</script>
