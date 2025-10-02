<template>
  <div class="bg-background min-h-screen py-10">
    <!-- 進度條 -->
    <div class="max-w-5xl mx-auto mb-10">
      <ProgressBar :currentStep="2" />
    </div>

    <!-- 表單 -->
    <Form
      :validation-schema="orderSchema"
      :validation-schema-params="{ isHome: isHome.value }"
      @submit="submitCheckout"
      v-slot="{ values }"
      class="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8 space-y-10"
    >
      <!-- 訂購資料 -->
      <OrderForm :isHome="isHome" />

      <!-- 收件資料 -->
      <section>
        <h2 class="text-xl font-bold mb-6">收件資料</h2>
        <div class="space-y-2 text-sm">
          <p>
            <span class="font-semibold">取貨方式：</span>
            {{ shippingMethod === "home" ? "宅配" : "門市自取" }}
          </p>
          <p>
            <span class="font-semibold">出貨日期：</span>
            <Field
              name="pickupDate"
              type="date"
              :min="minDate"
              :max="maxDate"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none max-w-xs"
            />
            <ErrorMessage name="pickupDate" class="text-red-500 text-sm" />
          </p>
          <!-- 右邊 注意事項 -->
          <div
            class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm leading-relaxed"
          >
            <h3 class="font-bold mb-2">訂購注意事項</h3>
            <ul class="list-decimal list-inside space-y-1 text-gray-700">
              <li>
                產品均為下單後新鮮製作，目前僅開放預訂下單日後3天至90天內出貨之訂單。
              </li>
              <li>
                冷藏冷凍蛋糕、客製化商品因保存期限較短，或依消費者要求所為之客製化，依法規定一經出貨即不可申請退貨退款。
              </li>
              <li>
                選擇門市自取之顧客，務必保留訂單編號，便於門市取貨時核對資料。
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 付款方式 -->
      <section>
        <h2 class="text-xl font-bold mb-6">付款方式</h2>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <Field
              name="paymentMethod"
              type="radio"
              value="信用卡"
              class="text-primary"
            />
            <span>信用卡</span>
          </label>
          <label
            v-if="shippingMethod === 'pickup'"
            class="flex items-center gap-2 cursor-pointer"
          >
            <Field
              type="radio"
              name="paymentMethod"
              value="現場付款"
              class="text-primary"
            />
            <span>現場付款</span>
          </label>
          <ErrorMessage name="paymentMethod" class="text-red-500 text-sm" />
        </div>

        <!-- TapPay 卡片欄位，只有信用卡時顯示 -->
        <div
          :class="{ hidden: values.paymentMethod !== '信用卡' }"
          class="mt-6 space-y-4"
        >
          <div
            class="tpfield border border-gray-300 rounded-lg px-3 py-2 w-full h-12"
            id="card-number"
          ></div>
          <div
            class="tpfield border border-gray-300 rounded-lg px-3 py-2 w-full h-12"
            id="card-expiration-date"
          ></div>
          <div
            class="tpfield border border-gray-300 rounded-lg px-3 py-2 w-full h-12"
            id="card-ccv"
          ></div>
        </div>
      </section>

      <!-- 確認付款 -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loading"
        >
          {{ loading ? "處理中..." : "確認付款" }}
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useCartStore } from "../stores/cartStore"
import { Form, Field, ErrorMessage } from "vee-validate"
import { orderSchema } from "../schemas/orderSchema"
import ProgressBar from "../components/Cart/CheckoutProgress.vue"
import OrderForm from "../components/Cart/OrderForm.vue"
import api from "../services/api"

const router = useRouter()
const cart = useCartStore()
const loading = ref(false)

// 從 Pinia summary 讀 shippingMethod（home / pickup）
const shippingMethod = computed(() => cart.summary?.shippingMethod)
const isHome = computed(() => shippingMethod.value === "home")

onMounted(() =>{
cart.fetchCart()

// 初始化 TapPay SDK
  TPDirect.setupSDK(
    import.meta.env.VITE_TAPPAY_APP_ID,
    import.meta.env.VITE_TAPPAY_APP_KEY,
    "sandbox"
  )

  TPDirect.card.setup({
    fields: {
      number: { element: "#card-number", placeholder: "**** **** **** ****" },
      expirationDate: { element: "#card-expiration-date", placeholder: "MM / YY" },
      ccv: { element: "#card-ccv", placeholder: "CCV" },
    },
    styles: {
      input: {
      "color": "#1f2937",        // text-gray-800
      "font-size": "16px",
      "font-family": "inherit",
      "letter-spacing": "0.05em",
      "padding": "0.5rem 0.75rem"
    },
    "input::placeholder": {
      "color": "#9ca3af"         // text-gray-400
    },
    ".valid": {
      "color": "#10b981"         // green-500
    },
    ".invalid": {
      "color": "#ef4444"         // red-500
    },
  }})
})


// 下單當天
const today = new Date()
// 計算最早 (today+3)
const min = new Date(today)
min.setDate(min.getDate() + 3)
// 計算最晚 (today+90)
const max = new Date(today)
max.setDate(max.getDate() + 90)

const minDate = ref(formatDate(min))
const maxDate = ref(formatDate(max))

// 格式化成 YYYY-MM-DD
function formatDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

// 送出訂單
async function submitCheckout(values) {
  loading.value = true
  try {
    const payload = {
      buyer: {
        name: values.name,
        phone: values.phone,
        email: values.email,
        address: isHome.value ? values.address : "N/A",
      },
      shippingMethod: shippingMethod.value,
      items: cart.items,
    }

    const { data } = await api.post("/orders", payload)
    const orderNo = data.orderNo

    if (values.paymentMethod === "現場付款") {
      router.push({ name: "order-complete", query: { orderNo: data.orderNo } })
    } else {
       // === TapPay 信用卡流程 ===
      TPDirect.card.getPrime(async (result) => {
        if (result.status !== 0) {
          alert("取得 prime 失敗：" + result.msg)
          loading.value = false
          return
        }

        const prime = result.card.prime
        console.log("取得 prime:", prime)

        try {
          const payRes = await api.post("/tappay/pay", {
            prime,
            orderNo,
          })

          if (payRes.data.success) {
            router.push({ name: "order-complete", query: { orderNo } })
          } else {
            alert("付款失敗：" + payRes.data.message)
          }
        } catch (err) {
          console.error("付款 API 錯誤", err)
          alert("付款失敗，請稍後再試")
        } finally {
          loading.value = false
        }
      })
    }
  } catch (e) {
    console.error("建立訂單失敗", e)
    alert("建立訂單失敗，請稍後再試")
    loading.value = false
  }
}
</script>
