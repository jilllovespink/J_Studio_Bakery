<template>
  <div>
    <h2>結帳頁面</h2>
    <button @click="payNow">立即付款</button>
    <form ref="ecpayForm" method="post" :action="action" style="display:none">
      <div v-for="(value, key) in params" :key="key">
        <input type="hidden" :name="key" :value="value" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const ecpayForm = ref(null);
const action = ref("");
const params = ref({});

async function payNow() {
  const { data } = await axios.post("http://localhost:3000/api/ecpay/create-order", {
    orderId: "TESTORDER12345",
    amount: 1000,
    itemName: "蛋糕一號"
  });

  action.value = data.action;
  params.value = data.params;

  // 自動送出表單到綠界
  setTimeout(() => {
    ecpayForm.value.submit();
  }, 100);
}
</script>
