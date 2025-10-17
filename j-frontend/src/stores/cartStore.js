import { defineStore } from "pinia";
import api from "../services/api.js";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // 購物車項目
    summary: {}, // 小計、折扣、運費、合計
    loading: false,
  }),

  actions: {
    // 1. 取得購物車
    async fetchCart() {
      this.loading = true;
      try {
        const res = await api.get("/cart");
        this.items = res.data.items;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("載入購物車失敗:", err);
      } finally {
        this.loading = false;
      }
    },

    // 2. 加入購物車
    async addToCart(variantId, quantity = 1) {
      try {
        const res = await api.post("/cart", { variantId, quantity });
        this.items = res.data.items;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("加入購物車失敗:", err);
      }
    },

    // 3. 更新商品數量
    async updateQuantity(variantId, quantity) {
      try {
        const res = await api.put(`/cart/${variantId}`, { quantity });
        this.items = res.data.items;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("更新數量失敗:", err);
      }
    },

    // 4. 移除單一商品
    async removeItem(variantId) {
      try {
        const res = await api.delete(`/cart/${variantId}`);
        this.items = res.data.items;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("刪除商品失敗:", err);
      }
    },

    // 5. 套用折扣碼
    async applyDiscount(code) {
      try {
        const res = await api.post("/cart/set-discount", { code });
        this.items = res.data.items;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("折扣碼失敗", err);
      }
    },

    // 6. 設定取貨方式
    async setShipping(method) {
      try {
        const res = await api.post("/cart/set-shipping", { method });
        this.items = res.data.items;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("設定取貨方式失敗", err);
      }
    },

    // ˙. 清空購物車
    async clearCart() {
      try {
        const res = await api.delete("/cart");
        this.items = res.data.items;
        this.summary = res.data.summary;
      } catch (err) {
        console.error("清空購物車失敗:", err);
      }
    },
  },

  getters: {
    // 總數量
    cartCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    cartTotal: (state) => state.total,
  },
});
