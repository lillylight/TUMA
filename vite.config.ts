import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Base public path when served in production
    base: './',
    
    // Server configuration
    server: {
      host: "::",
      port: 8080,
      strictPort: true,
    },
    
    // Preview server configuration
    preview: {
      port: 8080,
      strictPort: true,
    },
    
    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      chunkSizeWarningLimit: 1600,
    },
    
    // Environment variables exposed to the client
    define: {
      'process.env': {
        VITE_PUBLIC_ONCHAINKIT_API_KEY: JSON.stringify(env.VITE_PUBLIC_ONCHAINKIT_API_KEY),
        VITE_PUBLIC_PRODUCT_ID: JSON.stringify(env.VITE_PUBLIC_PRODUCT_ID),
        VITE_COINBASE_COMMERCE_API_KEY: JSON.stringify(env.VITE_COINBASE_COMMERCE_API_KEY),
        VITE_ARWEAVE_JWK_JSON: JSON.stringify(env.VITE_ARWEAVE_JWK_JSON),
      },
    },
    
    // Plugins
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    
    // Resolve configuration
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
