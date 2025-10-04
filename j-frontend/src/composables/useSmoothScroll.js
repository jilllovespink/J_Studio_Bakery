// src/composables/useSmoothScroll.js
import { nextTick } from "vue";

export async function smoothScrollTo(hash, opts = {}) {
  if (!hash) return;
  await nextTick();

  const { offset = 0, behavior = "smooth" } = opts;
  const el = document.querySelector(hash);
  if (!el) return;

  // 若不需要偏移，直接用 scrollIntoView 最簡潔
  if (!offset) {
    el.scrollIntoView({ behavior, block: "start" });
    return;
  }

  // 需要避開 sticky header → 計算座標位移
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior });
}

export async function smoothScrollToEl(el, opts = {}) {
  if (!el) return;
  await nextTick();
  const { offset = 0, behavior = "smooth" } = opts;
  if (!offset) {
    el.scrollIntoView({ behavior, block: "start" });
    return;
  }
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior });
}
