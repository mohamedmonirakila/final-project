import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./", // Set the base URL to the current directory
  build: {
    outDir: "../dist", // Output directory for built files
    assetsDir: "assets", // Directory to store assets like JS, CSS, etc.
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      allow: [
        "..", // Allows access to parent directory, adjust if necessary
        "C:/Users/ASUS/Desktop/final_project/server/images", // Path to your images folder
      ],
    },
  },
  resolve: {
    alias: {
      "/images": path.resolve(__dirname, "public/images"),
    },
  },
});
