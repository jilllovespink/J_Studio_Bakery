<template>
  <div class="bg-white shadow rounded-lg p-6 space-y-6">
    <h2 class="text-xl font-semibold">訂單總計</h2>

    <!-- 取貨方式 -->
    <div class="space-y-2">
      <label class="flex items-center space-x-2">
        <input
          type="radio"
          value="home"
          v-model="shippingMethod"
          @change="setShipping"
        />
        <span>宅配 (+NT$190)</span>
      </label>
      <label class="flex items-center space-x-2">
        <input
          type="radio"
          value="pickup"
          v-model="shippingMethod"
          @change="setShipping"
        />
        <span>門市自取 (免運)</span>
      </label>
    </div>

    <!-- 訂單金額 -->
    <div class="border-t pt-4 space-y-2">
      <p>小計：NT$ {{ cart.summary?.subtotal }}</p>
      <p>折扣：-NT$ {{ cart.summary?.discountAmount }}</p>
      <p>運費：NT$ {{ cart.summary?.shippingFee }}</p>
      <p class="text-lg font-bold">合計：NT$ {{ cart.summary?.total }}</p>
    </div>

    <button class="btn btn-primary w-full">前往結帳</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "../../stores/cartStore";

const cart = useCartStore();
const shippingMethod = ref("home");

function setShipping() {
  cart.setShipping(shippingMethod.value);
}
</script>
