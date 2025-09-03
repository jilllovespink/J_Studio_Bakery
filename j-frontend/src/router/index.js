import { createRouter, createWebHistory } from "vue-router";
import Layout from "../layouts/Layout.vue";

import HomeView from "../views/HomeView.vue";
// import AboutView from "@/views/AboutView.vue";
// import ProductsView from "@/views/ProductsView.vue";
// import ProductDetailView from "@/views/ProductDetailView.vue";
// import ArticlesView from "@/views/ArticlesView.vue";

const routes = [
  {
    path: "/",
    component: Layout, // 共用 Layout
    children: [
      { path: "", name: "home", component: HomeView },
      //   { path: "about", name: "about", component: AboutView },
      //   { path: "products", name: "products", component: ProductsView },
      //   {
      //     path: "products/:slug",
      //     name: "product-detail",
      //     component: ProductDetailView,
      //   },
      //   { path: "articles", name: "articles", component: ArticlesView },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
