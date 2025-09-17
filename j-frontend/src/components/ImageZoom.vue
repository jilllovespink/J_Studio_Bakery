<template>
  <div
    class="relative overflow-hidden rounded-lg shadow group"
    @mousemove="onMouseMove"
    @mouseleave="resetZoom"
  >
    <LazyImage
      ref="imageRef"
      :src="src"
      :alt="alt"
      class="w-full h-auto transition-transform duration-300 ease-in-out group-hover:scale-125 object-cover"
      :style="imageStyle"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import LazyImage from "../components/LazyImage.vue";

const props = defineProps({
  src: String,
  alt: String,
});

const imageRef = ref(null);
const imageStyle = ref({});

function onMouseMove(e) {
  if (!imageRef.value?.$el) return;
  const rect = imageRef.value.$el.getBoundingClientRect(); // LazyImage 外層 <img>
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  imageStyle.value = {
    transformOrigin: `${x}% ${y}%`,
  };
}

function resetZoom() {
  imageStyle.value = { transformOrigin: "center center" };
}
</script>
