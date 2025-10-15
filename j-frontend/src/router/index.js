import { createRouter, createWebHistory } from "vue-router";
import Layout from "../layouts/Layout.vue";

import HomeView from "../views/HomeView.vue";
import NewsView from "../views/NewsView.vue";
import ProductsView from "../views/ProductsView.vue";

import ProductDetailView from "../views/ProductDetailView.vue";
import ArticlesView from "../views/ArticlesView.vue";
import ArticleDetailView from "../views/ArticleDetailView.vue";

import CartView from "../views/CartView.vue";
import PaymentView from "../views/PaymentView.vue";
import OrderCompleteView from "../views/OrderCompleteView.vue";
import CheckoutView from "../views/CheckoutView.vue";

import NewsDetailView from "../views/NewsDetailView.vue";

const routes = [
  {
    path: "/",
    component: Layout, // 共用 Layout
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
        meta: {
          title: "首頁｜娟姐烘焙坊",
          description:
            "娟姐烘焙坊以愛與溫度手作甜點，提供蛋糕、餅乾、馬卡龍等多樣選擇，讓甜點成為最幸福的日常。",
        },
      },
      {
        path: "products/:categorySlug",
        name: "product",
        component: ProductsView,
        meta: {
          dynamicTitle: true,
          description: "精選食材與細膩手工，呈現每款甜點的完美風味。",
        },
      },
      {
        path: "products/detail/:slug",
        name: "productDetail",
        component: ProductDetailView,
        meta: { dynamicTitle: true },
      },
      {
        path: "/products",
        name: "productsRedirect",
        redirect: "/products/top10",
        meta: {
          title: "甜點系列｜娟姐烘焙坊",
          description:
            "探索娟姐烘焙坊的各式甜點分類，包含經典蛋糕、生乳捲、手工餅乾與季節限定商品。",
        },
      },
      {
        path: "news",
        name: "news",
        component: NewsView,
        meta: {
          title: "最新消息｜娟姐烘焙坊",
          description:
            "掌握娟姐烘焙坊的最新活動、優惠與媒體報導，第一時間了解娟姐新動態。",
        },
      },
      {
        path: "news/:id",
        name: "newsDetailView",
        component: NewsDetailView,
        meta: {
          dynamicTitle: true,
          description:
            "了解最新活動與品牌故事，感受娟姐烘焙坊的每一步成長與溫暖。",
        },
      },

      { path: "articles", redirect: "/articles/juans-recipes" },
      {
        path: "articles/:categorySlug",
        name: "articles",
        component: ArticlesView,
        meta: {
          title: "烘焙專欄｜娟姐烘焙坊",
          description:
            "閱讀娟姐獨家烘焙食譜與甜點教學，學習更多烘焙技巧與靈感。",
        },
      },
      {
        path: "articles/:slug",
        name: "articleDetail",
        component: ArticleDetailView,
        meta: {
          dynamicTitle: true,
          description:
            "娟姐烘焙坊分享烘焙心得、甜點食譜與生活靈感，陪你一起品味甜點時光。",
        },
      },
      {
        path: "cart",
        name: "cart",
        component: CartView,
        meta: {
          title: "購物車｜娟姐烘焙坊",
          description:
            "檢視您的甜點購物清單，確認數量與組合，準備結帳前的最後一步。",
        },
      },
      {
        path: "checkout",
        name: "checkout",
        component: CheckoutView,
        meta: {
          title: "結帳資訊｜娟姐烘焙坊",
          description: "填寫收件資訊與付款方式，完成甜點訂購流程。",
        },
      },
      {
        path: "order-complete",
        name: "order-complete",
        component: OrderCompleteView,
        meta: {
          title: "訂單完成｜娟姐烘焙坊",
          description: "感謝您的訂購！娟姐烘焙坊將盡快為您準備美味甜點。",
        },
      },
      {
        path: "payment",
        name: "payment",
        component: PaymentView,
        meta: {
          title: "付款中｜娟姐烘焙坊",
          description: "正在處理您的付款，請稍候片刻。",
        },
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("../views/NotFoundView.vue"),
        meta: {
          title: "找不到頁面｜娟姐烘焙坊",
          description: "抱歉，您造訪的頁面不存在，請返回首頁。",
        },
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

router.afterEach((to) => {
  const defaultTitle = "娟姐烘焙坊";
  const defaultDesc = "以愛與溫度手作每一道甜點，帶給您幸福的甜蜜滋味。";

  // redirect 時會先跳到 redirect 定義，再進目標頁，所以要確保最後目的地的 meta 會覆蓋
  const finalTitle = to.meta.title || defaultTitle;
  const finalDesc = to.meta.description || defaultDesc;

  // 如果是動態頁，就先不動 title，等 usePageMeta 接手
  if (!to.meta.dynamicTitle || !to.meta.title) {
    document.title = finalTitle;
  }

  const descTag = document.querySelector('meta[name="description"]');
  if (descTag) {
    descTag.setAttribute("content", finalDesc);
  } else {
    const tag = document.createElement("meta");
    tag.name = "description";
    tag.content = finalDesc;
    document.head.appendChild(tag);
  }
});

export default router;
