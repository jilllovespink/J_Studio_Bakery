<template>
  <div class="flex justify-between items-center">
    <div
      v-for="(step, idx) in steps"
      :key="idx"
      class="flex items-center flex-1"
    >
      <!-- 圓圈 -->
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center font-bold"
        :class="currentStep === idx + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'"
      >
        {{ idx + 1 }}
      </div>
      <!-- 標題 -->
      <span class="ml-2 font-medium">{{ step }}</span>
      <!-- 連接線 -->
      <div
        v-if="idx < steps.length - 1"
        class="flex-1 h-[2px] bg-gray-300 mx-4"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: { type: Number, default: 1 },
});
const steps = ["購物清單", "填寫資訊", "完成訂單"];
</script>
