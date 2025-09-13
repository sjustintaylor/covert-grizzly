import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/code/covert-grizzly/" : "/",
  build: {
    outDir: "dist",
  },
});
