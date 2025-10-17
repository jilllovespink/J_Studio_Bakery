<template>
  <div
    class="bg-background min-h-screen flex flex-col items-center justify-center py-6 px-4"
  >
    <!-- 進度條 -->
    <div class="w-full max-w-5xl mb-8">
      <ProgressBar :currentStep="3" />
    </div>

    <!-- 訂單完成卡片 -->
    <div class="w-full max-w-3xl bg-white shadow rounded-2xl p-6 sm:p-8">
      <div class="text-center mb-6 sm:mb-8">
        <div
          class="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full bg-green-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 sm:h-8 sm:w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold">訂單完成</h1>
        <p class="text-muted-foreground mt-2 text-sm sm:text-base">
          感謝您的購買，我們已收到您的訂單！
        </p>
      </div>

      <!-- 訂單詳細資訊 -->
      <div v-if="order" class="space-y-6">
        <!-- 基本資訊 -->
        <div class="bg-accent p-4 sm:p-6 rounded-lg">
          <h2 class="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
            訂單資訊
          </h2>
          <ul class="space-y-1 sm:space-y-2 text-xs sm:text-sm">
            <li>
              <span class="font-medium">訂單編號：</span>{{ order.orderNo }}
            </li>
            <li>
              <span class="font-medium">姓名：</span>{{ order.buyerName }}
            </li>
            <li><span class="font-medium">電話：</span>{{ order.phone }}</li>
            <li><span class="font-medium">Email：</span>{{ order.email }}</li>
            <li>
              <span class="font-medium">取貨方式：</span>
              {{ order.shippingMethod === "home" ? "宅配" : "門市自取" }}
            </li>
            <li v-if="order.shippingMethod === 'home'">
              <span class="font-medium">地址：</span>{{ order.address }}
            </li>
            <li>
              <span class="font-medium">預計出貨日：</span>
              {{ formatDate(order.shipDate) }}
            </li>
            <li>
              <span class="font-medium">付款狀態：</span>
              <span
                :class="
                  order.status === 'PAID'
                    ? 'text-green-600 font-semibold'
                    : 'text-red-500 font-semibold'
                "
              >
                {{ order.status === "PAID" ? "已付款" : "待付款" }}
              </span>
            </li>
          </ul>
        </div>

        <!-- 商品清單 -->
        <div class="bg-accent p-4 sm:p-6 rounded-lg">
          <h2 class="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
            訂購品項
          </h2>
          <ul class="divide-y divide-gray-200 text-xs sm:text-sm">
            <li
              v-for="item in order.orderitem"
              :key="item.id"
              class="py-2 flex justify-between"
            >
              <span>
                {{ item.productName }}
                <span v-if="item.variantName"> ({{ item.variantName }})</span>
                × {{ item.qty }}
              </span>
              <span>NT$ {{ item.unitPrice * item.qty }}</span>
            </li>
          </ul>
          <div class="mt-3 sm:mt-4 text-right space-y-1 text-xs sm:text-sm">
            <p>小計：NT$ {{ order.subtotal }}</p>
            <p>運費：NT$ {{ order.shippingFee }}</p>
            <p
              v-if="order.discountAmount && order.discountAmount > 0"
              class="text-green-600 font-medium"
            >
              折扣金額：-NT$ {{ order.discountAmount }}
            </p>
            <p class="font-bold text-base sm:text-lg">
              總計：NT$ {{ order.totalAmount }}
            </p>
          </div>
        </div>
      </div>

      <!-- 按鈕 -->
      <div
        class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 sm:mt-8"
      >
        <router-link to="/" class="btn btn-outline w-full sm:w-auto"
          >回首頁</router-link
        >
        <router-link
          to="/products/top10"
          class="btn btn-primary w-full sm:w-auto"
        >
          瀏覽其他商品
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ProgressBar from "../components/Cart/CheckoutProgress.vue";
import api from "../services/api";

const route = useRoute();
const order = ref(null);

onMounted(async () => {
  const orderNo = route.query.orderNo;
  if (orderNo) {
    try {
      const { data } = await api.get(`/orders/${orderNo}`);
      order.value = data;
    } catch (err) {
      console.error("取得訂單失敗", err);
    }
  }
});

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(d.getDate()).padStart(2, "0")}`;
}
</script>
