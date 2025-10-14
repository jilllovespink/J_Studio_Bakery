<template>
  <section
    class="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6"
  >
    <!-- 404 + 圖片 -->
    <div class="relative mb-6">
      <h1
        class="text-[160px] font-bold text-[color:var(--color-muted-foreground)] opacity-30 leading-none"
      >
        404
      </h1>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[8px] border-[color:var(--color-primary)] overflow-hidden bg-white"
      >
        <img
          src="https://images.unsplash.com/photo-1730416306663-8c42cfddba02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXBjYWtlJTIwZGVzc2VydHxlbnwxfHx8fDE3NjAzNjcxMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="找不到頁面甜點圖"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- 標題 -->
    <h2 class="text-3xl md:text-4xl font-bold mb-4">哎呀！找不到這個頁面</h2>

    <!-- 副標 -->
    <p class="text-[color:var(--color-muted-foreground)] mb-2">
      看來您要找的甜點不在這個烤箱裡～
    </p>
    <p class="text-[color:var(--color-muted-foreground)] mb-8">
      或許這個頁面已經被吃掉了，讓我們幫您找到其他美味的選擇吧！
    </p>

    <!-- 按鈕 -->
    <div class="flex flex-wrap gap-4 justify-center mb-12">
      <RouterLink to="/" class="btn btn-primary"> 回到首頁 </RouterLink>
      <RouterLink to="/products" class="btn btn-secondary">
        熱門產品
      </RouterLink>
    </div>

    <!-- 下方裝飾圓圈 -->
    <div class="flex items-center justify-center gap-8 mt-10 opacity-80">
      <div
        class="w-14 h-14 rounded-full bg-[color:var(--color-primary)]/20"
      ></div>
      <div
        class="w-10 h-10 rounded-full bg-[color:var(--color-secondary)]/30"
      ></div>
      <div
        class="w-20 h-20 rounded-full bg-[color:var(--color-primary)]/20"
      ></div>
      <div
        class="w-10 h-10 rounded-full bg-[color:var(--color-secondary)]/30"
      ></div>
      <div
        class="w-14 h-14 rounded-full bg-[color:var(--color-primary)]/20"
      ></div>
    </div>
  </section>
</template>
