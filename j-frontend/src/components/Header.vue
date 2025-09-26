<template>
  <header class="w-full bg-white shadow sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Flogo%2FScreenshot%202025-09-02%20170034.png?alt=media&token=ec2f47cf-bea8-4bb7-9fe5-be464fdf764e"
          alt="娟姊的烘焙工作室"
          class="h-16 w-auto hover:opacity-80 transition"
        />
      </router-link>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative text-foreground hover:text-primary transition-colors font-semibold"
          exact-active-class="text-primary"
        >
          {{ link.label }}
          <!-- active underline -->
          <span
            v-if="$route.path === link.to"
            class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
          ></span>
        </router-link>
      </nav>

      <!-- Search + Icons (Desktop) -->
      <div class="hidden md:flex items-center gap-4 relative">
        <!-- 搜尋框 -->
        <div
          class="flex items-center bg-input-background rounded-lg px-3 py-1 border border-border focus-within:ring-2 ring-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-muted-foreground hover:text-primary transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
            />
          </svg>
          <input
            v-model="query"
            type="text"
            placeholder="搜尋甜點..."
            class="bg-transparent focus:outline-none px-2 text-sm w-48"
            @input="searchProducts"
          />
        </div>

        <!-- 搜尋結果下拉 -->
        <div
          v-if="showResults && results.length"
          class="absolute top-12 left-0 w-72 bg-white shadow-lg rounded-md border border-border z-50"
        >
          <ul>
            <li
              v-for="p in results"
              :key="p.id"
              @click="goToProduct(p.slug)"
              class="px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-white cursor-pointer transition"
            >
              {{ p.name }} - ${{ p.minPrice }}
            </li>
          </ul>
        </div>

        <!-- 購物車 -->
        <router-link
          to="/cart"
          class="relative text-primary hover:text-primary/80 transition"
        >
          <FontAwesomeIcon :icon="faCartShopping" class="h-6 w-6" />

          <!-- 數量 Badge -->
          <span
            v-if="cart.cartCount > 0"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5"
          >
            {{ cart.cartCount }}
          </span>
        </router-link>

        <!-- 登入 -->
        <router-link
          to="/login"
          class="text-primary hover:text-primary/80 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.121 17.804A9 9 0 1118 9m-6 12v-6m0 0v-6m0 6h6m-6 0H6"
            />
          </svg>
        </router-link>
      </div>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 rounded-md hover:bg-muted"
        @click="toggleMenu"
        aria-label="Toggle Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            v-if="!isOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="isOpen" class="md:hidden bg-white border-t border-border">
      <nav class="flex flex-col gap-4 p-4">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-foreground hover:text-primary transition"
          @click="toggleMenu"
        >
          {{ link.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useCartStore } from "../stores/cartStore"; // 引入 Pinia Store
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const router = useRouter();
const isOpen = ref(false);
const query = ref("");
const results = ref([]);
const showResults = ref(false);
const cart = useCartStore()


const navLinks = [
  { label: "首頁", to: "/" },
  { label: "關於我們", to: "/about" },
  { label: "甜點系列", to: "/products" },
  { label: "烘焙祕訣", to: "/articles" },
];

const toggleMenu = () => (isOpen.value = !isOpen.value);

const searchProducts = async () => {
  if (!query.value.trim()) {
    results.value = [];
    showResults.value = false;
    return;
  }
  try {
    const res = await axios.get(`http://localhost:3000/api/products?search=${query.value}`);
    results.value = res.data || [];
    showResults.value = true;
  } catch (err) {
    console.error("搜尋失敗:", err);
  }
};

const goToProduct = (slug) => {
  query.value = "";
  results.value = [];
  showResults.value = false;
  router.push(`/products/${slug}`);
};

// 元件掛載時載入購物車
onMounted(() => {
  cart.fetchCart();
});
</script>
