<template>
  <router-view />
</template>
<script setup>
import { onMounted } from "vue";
import { useCartStore } from "./stores/cartStore.js";

onMounted(async () => {
  const cart = useCartStore();
  await cart.fetchCart();
});
</script>
