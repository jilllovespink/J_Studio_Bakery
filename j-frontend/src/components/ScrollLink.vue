<template>
  <a href="#" @click.prevent="scroll" class="cursor-pointer">
    <slot />
  </a>
</template>

<script setup>
import { smoothScrollTo } from "../composables/useSmoothScroll.js";

const props = defineProps({
  target: { type: String, required: true },
  offset: { type: Number, default: 0 },
  behavior: { type: String, default: "smooth" },
});

const scroll = () => {
  smoothScrollTo(props.target, { offset: props.offset, behavior: props.behavior });
};
</script>
