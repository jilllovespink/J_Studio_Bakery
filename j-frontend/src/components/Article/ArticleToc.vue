<template>
  <div
    v-if="toc.length"
    class="bg-white rounded-xl shadow p-6 mb-10 border border-[var(--color-border)]"
  >
    <!-- 標題列 -->
    <div class="flex items-center mb-4">
      <span class="text-primary text-lg mr-2">☰</span>
      <h3 class="font-semibold text-lg text-foreground">文章目錄</h3>
    </div>

    <!-- 目錄列表 -->
    <ul class="space-y-2">
      <li
        v-for="item in toc"
        :key="item.id"
        :class="[
          'transition-all',
          item.level === 3 ? 'ml-6 text-[0.95rem]' : 'text-base',
        ]"
      >
        <ScrollLink
          :target="`#${item.id}`"
          :offset="offset"
          class="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <span class="inline-block text-muted-foreground select-none">
            {{ item.level === 3 ? '⦿' : '▶' }}
          </span>
          <span>{{ item.text }}</span>
        </ScrollLink>
      </li>
    </ul>

    <!-- 底部提示 -->
    <p
      class="text-sm text-muted-foreground mt-5 pt-3 border-t border-[var(--color-border)]"
    >
      點擊目錄可快速跳轉至該段落
    </p>
  </div>
</template>

<script setup>
import ScrollLink from "@/components/ScrollLink.vue";

defineProps({
  toc: {
    type: Array,
    default: () => [],
  },
  offset: {
    type: Number,
    default: 100, // header 高度
  },
});
</script>

<style scoped>
a {
  @apply block w-full text-left;
}
</style>
