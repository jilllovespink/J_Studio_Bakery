<template>
  <section>
    <h2 class="text-xl font-bold mb-6">訂購資料</h2>
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium mb-1">姓名 *</label>
        <Field
          name="name"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">
          連絡電話（公司電話請留分機） *
        </label>
        <Field
          name="phone"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium mb-1">Email *</label>
        <Field
          name="email"
          type="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
      </div>

      <!-- 地址只在宅配顯示 -->
      <div v-if="isHome" class="md:col-span-2">
        <label class="block text-sm font-medium mb-1">收件地址 *</label>
        <Field
          name="address"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <ErrorMessage name="address" class="text-red-500 text-sm mt-1" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { Field, ErrorMessage } from "vee-validate"

defineProps({
  isHome: { type: Boolean, required: true },
})
</script>
