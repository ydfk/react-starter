/*
 * @Description: Copyright (c) ydfk. All rights reserved
 * @Author: ydfk
 * @Date: 2026-02-02 20:49:22
 * @LastEditors: ydfk
 * @LastEditTime: 2026-02-02 21:48:49
 */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载当前模式下的环境变量
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT),
      // proxy: {
      //   '/api': {
      //     target: env.VITE_PROXY_HOST, // 替换为你的实际 API 服务器地址
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },
  };
});
