import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
  },
  plugins: [vue(), tailwindcss()],
  watch: {
    usePolling: true, // required on Windows + Docker
    interval: 1000, // check file changes every 1s
  },
  server: {
    host: "0.0.0.0", // 允許從外部（Docker、區網）訪問
    port: 5173, // 指定 port，預設就是 5173
  },
});
