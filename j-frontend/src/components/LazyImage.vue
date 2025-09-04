<template>
  <img
    ref="imageRef"
    :src="shouldLoad ? src : placeholder"
    :alt="alt"
    class="w-full h-full object-cover transition-opacity duration-700"
    :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
    @load="onLoad"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: "" },
  placeholder: {
    type: String,
    default: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI2MCUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg=="
  }
});

const loaded = ref(false);
const shouldLoad = ref(false);
const imageRef = ref(null);

let observer;

const onLoad = () => {
  loaded.value = true;
};

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        shouldLoad.value = true;
        observer.unobserve(entry.target);
      }
    });
  });

  if (imageRef.value) {
    observer.observe(imageRef.value);
  }
});

onBeforeUnmount(() => {
  if (observer && imageRef.value) {
    observer.unobserve(imageRef.value);
  }
});
</script>
