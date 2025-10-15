import { watchEffect } from "vue";

export function usePageMeta({ title, description }) {
  watchEffect(() => {
    // 更新 <title>
    const rawTitle = title.value?.trim();
    document.title =
      rawTitle && !rawTitle.includes("娟姐烘焙坊")
        ? `${rawTitle}｜娟姐烘焙坊`
        : rawTitle || "娟姐烘焙坊";

    // ---- 更新 <meta description> ----
    const desc =
      description.value?.trim() ||
      "以愛與溫度手作每一道甜點，帶給您幸福的甜蜜滋味。";

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.name = "description";
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", desc);
  });
}
