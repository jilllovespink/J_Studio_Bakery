import { defineStore } from "pinia";
import api from "../services/api.js";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [], // 購物車項目
    total: 0, // 總金額
  }),

  actions: {
    // 1. 取得購物車
    async fetchCart() {
      try {
        const res = await api.get("/cart", { withCredentials: true });
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (err) {
        console.error("載入購物車失敗:", err);
      }
    },

    // 2. 加入購物車
    async addToCart(variantId, quantity = 1) {
      try {
        const res = await api.post(
          "/cart",
          { variantId, quantity },
          { withCredentials: true }
        );
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (err) {
        console.error("加入購物車失敗:", err);
      }
    },

    // 3. 更新商品數量
    async updateQuantity(variantId, quantity) {
      try {
        const res = await api.put(
          `/cart/${variantId}`,
          { quantity },
          { withCredentials: true }
        );
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (err) {
        console.error("更新數量失敗:", err);
      }
    },

    // 4. 移除單一商品
    async removeItem(variantId) {
      try {
        const res = await api.delete(`/cart/${variantId}`, {
          withCredentials: true,
        });
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (err) {
        console.error("刪除商品失敗:", err);
      }
    },

    // 5. 清空購物車
    async clearCart() {
      try {
        const res = await api.delete("/cart", { withCredentials: true });
        this.items = res.data.items;
        this.total = res.data.total;
      } catch (err) {
        console.error("清空購物車失敗:", err);
      }
    },
  },

  getters: {
    // 總數量
    cartCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    // 總金額（這裡用 state.total，避免前端算錯）
    cartTotal: (state) => state.total,
  },
});
