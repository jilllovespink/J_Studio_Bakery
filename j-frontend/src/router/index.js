import { createRouter, createWebHistory } from "vue-router";
import Layout from "../layouts/Layout.vue";

import HomeView from "../views/HomeView.vue";
// import AboutView from "@/views/AboutView.vue";
import ProductsView from "../views/ProductsView.vue";

import ProductDetailView from "../views/ProductDetailView.vue";
import ArticlesView from "../views/ArticlesView.vue";
import CartView from "../views/CartView.vue";
import PaymentView from "../views/PaymentView.vue";
import OrderCompleteView from "../views/OrderCompleteView.vue";
import CheckoutView from "../views/CheckoutView.vue";

const routes = [
  {
    path: "/",
    component: Layout, // 共用 Layout
    children: [
      { path: "", name: "home", component: HomeView },
      //   { path: "about", name: "about", component: AboutView },
      {
        path: "products/:categorySlug",
        name: "product",
        component: ProductsView,
      },
      {
        path: "products/detail/:slug",
        name: "productDetail",
        component: ProductDetailView,
      },
      {
        path: "/products",
        redirect: "/products/top10",
      },
      { path: "articles", redirect: "/articles/juans-recipes" },
      {
        path: "articles/:categorySlug",
        name: "articles",
        component: ArticlesView,
      },

      { path: "cart", name: "cart", component: CartView },
      { path: "checkout", name: "checkout", component: CheckoutView },
      {
        path: "order-complete",
        name: "order-complete",
        component: OrderCompleteView,
      },
      {
        path: "payment",
        name: "payment",
        component: PaymentView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

export default router;
