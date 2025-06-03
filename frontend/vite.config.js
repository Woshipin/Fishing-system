import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

// import { defineConfig } from 'vite';
// import tailwindcss from "@tailwindcss/vite";
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     port: 3000,             // 可自定义端口
//     open: true,             // 自动打开浏览器
//     proxy: {
//       '/api': 'http://127.0.0.1:8000',  // Laravel API 代理
//     },
//   },
// });
