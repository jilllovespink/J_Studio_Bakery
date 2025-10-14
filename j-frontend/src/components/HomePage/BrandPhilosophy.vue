<template>
  <section class="bg-background py-20">
    <div
      class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6"
    >
      <!-- 左側文字 -->
      <div class="flex-1">
        <h2 class="text-3xl font-bold mb-6 text-gray-900">
          用心烘焙每一份甜蜜
        </h2>
        <p class="text-lg leading-relaxed text-gray-700 mb-4">
          在娟姐工作室裡，每一個甜點都是藝術品。我們堅持使用最優質的食材，
          以傳統手工技法結合現代創意，為您創造難忘的味覺體驗。
        </p>
        <p class="text-lg leading-relaxed text-gray-700 mb-8">
          從早晨的第一縷陽光開始，娟姐就在工作室裡忙碌著，
          用她的巧手和對甜點的熱愛，為每一位顧客帶來溫暖與甜蜜。
        </p>
      </div>

      <!-- 右側圖片 -->
      <div class="flex-1 relative">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Fbrand%2Fphilosophy-bread.jpg?alt=media&token=123456"
          alt="品牌理念麵包圖"
          class="rounded-2xl shadow-lg w-full object-cover"
        />
        <!-- 經驗圈 -->
        <div
          class="absolute -bottom-8 -left-8 bg-[#fcd77f] rounded-full w-28 h-28 flex flex-col items-center justify-center text-white shadow-md"
        >
          <span class="text-2xl font-bold text-gray-800">20+</span>
          <span class="text-sm text-gray-700">年經驗</span>
        </div>
      </div>
    </div>
  </section>
</template>
