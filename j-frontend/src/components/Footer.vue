<template>
  <footer class="bg-white border-t border-border mt-12">
    <!-- 上半部：三欄 -->
    <div
      class="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      <!-- 左：品牌資訊 -->
      <div>
        <div class="flex items-center gap-2 mb-4">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/course-platform-3fe65.firebasestorage.app/o/j%20studio%2Flogo%2F6ffabd4e-cb31-40b6-a48e-fd7151ef7d29.png?alt=media&token=2c6f297e-65e2-45c3-a091-ad7efd8c7abd"
            alt="娟姊烘焙坊 Logo"
            class="h-10 w-auto"
          />
          <h2 class="text-lg font-semibold">娟姊烘焙坊</h2>
        </div>
        <p class="text-sm text-muted-foreground">
          專注於手工精緻甜點，用心烘焙每一份溫暖與甜蜜，為您的日常生活增添美好時光。
        </p>
      </div>

      <!-- 中：聯絡資訊 -->
      <div>
        <h3 class="text-lg font-semibold mb-4">聯絡資訊</h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2">
            <FontAwesomeIcon
              :icon="['fas', 'map-marker-alt']"
              class="text-primary"
            />
            台北市大安區復興南路一段123號
          </li>
          <li class="flex items-center gap-2">
            <FontAwesomeIcon :icon="['fas', 'phone']" class="text-primary" />
            02-2701-2345
          </li>
          <li class="flex items-center gap-2">
            <FontAwesomeIcon :icon="['fas', 'envelope']" class="text-primary" />
            info@juanpatisserie.com
          </li>
        </ul>
      </div>

      <!-- 右：追蹤我們 -->
      <div>
        <h3 class="text-lg font-semibold mb-4">追蹤我們</h3>
        <div class="flex gap-3 mb-4">
          <a
            href="#"
            class="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-80 transition"
          >
            <FontAwesomeIcon :icon="['fab', 'facebook-f']" />
          </a>
          <a
            href="#"
            class="w-9 h-9 flex items-center justify-center rounded-full bg-secondary text-foreground hover:opacity-80 transition"
          >
            <FontAwesomeIcon :icon="['fab', 'instagram']" />
          </a>
          <a
            href="#"
            class="w-9 h-9 flex items-center justify-center rounded-full bg-primary text-white hover:opacity-80 transition"
          >
            <FontAwesomeIcon :icon="['fab', 'line']" />
          </a>
        </div>
      </div>
    </div>

    <!-- 下半部：版權聲明 -->
    <div class="border-t border-border">
      <div
        class="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground gap-2"
      >
        <p class="text-sm text-muted-foreground">
          © 2025 娟姊烘焙坊 Juan's Patisserie Studio. All rights reserved. |
          網頁設計 by <span class="text-primary font-medium">DJ 網頁設計</span>
        </p>
      </div>
    </div>
  </footer>
</template>
