<template>
  <div class="max-w-7xl mx-auto px-4 py-10 space-y-10">
    <!-- 進度條 -->
    <CheckoutProgress :currentStep="1" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- 左側：購物清單 + 折扣碼 + 加購專區 -->
      <div class="lg:col-span-2 space-y-10">
        <CartList />
        <AddonSection />
      </div>

      <!-- 右側：取貨方式與總計 -->
      <ShippingAndSummary />
    </div>
  </div>
</template>

<script setup>
import CheckoutProgress from "../components/cart/CheckoutProgress.vue";
import CartList from "../components/cart/CartList.vue";
import AddonSection from "../components/cart/AddonSection.vue";
import ShippingAndSummary from "../components/cart/ShippingAndSummary.vue";
</script>
