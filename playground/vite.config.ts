import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  root: new URL(".", import.meta.url).pathname,
  plugins: [tailwindcss()],
  build: { outDir: "../playground-dist", emptyOutDir: true },
});
