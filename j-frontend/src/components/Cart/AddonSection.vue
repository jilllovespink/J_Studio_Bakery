<template>
  <div class="bg-white shadow rounded-lg p-6 space-y-6">
    <h2 class="text-xl font-semibold">加購專區</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div
        v-for="addon in addons"
        :key="addon.id"
        class="border rounded p-4 flex flex-col items-center"
      >
        <img :src="addon.imageUrl" alt="" class="w-24 h-24 object-cover mb-2" />
        <p class="font-medium">{{ addon.name }}</p>
        <p class="text-gray-600">NT$ {{ addon.price }}</p>
        <button @click="addAddon(addon)" class="btn btn-secondary mt-3">
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

onMounted(async () => {
  const res = await api.get("/addons");
  addons.value = res.data;
});

function addAddon(addon) {
  cart.addToCart(addon.id, 1); // 直接呼叫購物車 store
}
</script>
