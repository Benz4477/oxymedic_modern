import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
   allowedHosts: [
      'recognised-gibraltar-seeds-choosing.trycloudflare.com',
      '.trycloudflare.com',
      'all'],
    cors: true,
    origin: 'https://sweet-owl-99.loca.lt',
proxy: {
  "/api": {
    target: "http://localhost:5000",
    changeOrigin: true,
  },
},
  },
  theme: {
    extend: {
      keyframes: {
        loginIn: {
          from: { opacity: 0, transform: "scale(0.94) translateY(20px)" },
          to: { opacity: 1, transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        loginIn: "loginIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)",
      },
    },
  },
});
