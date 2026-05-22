import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Permite imports limpos como: import { useChat } from '@/hooks/useChat'
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },

  server: {
    port: 5173,
    proxy: {
      // Redireciona chamadas /api/* para o backend FastAPI em :8000
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        // Separa vendors para melhor cache
        manualChunks: (id: string) => {
          if (id.includes("react-dom") || id.includes("react/")) return "react";
          if (id.includes("react-router-dom")) return "router";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("zustand")) return "zustand";
        },
      },
    },
  },
});