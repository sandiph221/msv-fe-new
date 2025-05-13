import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      //   src: path.resolve(__dirname, "./src"),
      Functions: path.resolve(__dirname, "./src/utils/Functions.js"),
      Components: path.resolve(__dirname, "./src/Components"),
      assets: path.resolve(__dirname, "./src/assets"),
      Customer: path.resolve(__dirname, "./src/Customer"),
      Pages: path.resolve(__dirname, "./src/Pages"),
      store: path.resolve(__dirname, "./src/store"),
      utils: path.resolve(__dirname, "./src/utils"),
    },
  },
  optimizeDeps: {
    include: ["xlsx"],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/, /xlsx/],
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
