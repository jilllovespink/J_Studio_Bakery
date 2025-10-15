<template>
  <header class="w-full bg-white shadow sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Flogo%2F6ffabd4e-cb31-40b6-a48e-fd7151ef7d29.png?alt=media&token=1697fe0b-3d46-4b58-8997-ee24d197bab4"
          alt="娟姊烘焙坊"
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
            v-if="link.to === '/' 
    ? $route.path === '/' 
    : $route.path === link.to || $route.path.startsWith(link.to + '/')"
            class="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
          ></span>
        </router-link>
      </nav>

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
  { label: "最新消息", to: "/news" },
  { label: "甜點系列", to: "/products" },
  { label: "烘焙祕訣", to: "/articles" },
];

const toggleMenu = () => (isOpen.value = !isOpen.value);

// 元件掛載時載入購物車
onMounted(() => {
  cart.fetchCart();
});
</script>
