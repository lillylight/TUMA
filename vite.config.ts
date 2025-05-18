import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    react(),
<<<<<<< HEAD
    // Temporarily disabled lovable-tagger as it's causing build issues
    // mode === 'development' &&
    // componentTagger(),
=======
    mode === 'development' &&
    componentTagger(),
>>>>>>> 97caf59870c63b920bb0d4c1f1aa9cb4dd22b0fd
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
