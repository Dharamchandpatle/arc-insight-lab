import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Allow access from network (0.0.0.0 means all interfaces)
    port: 8080,
    proxy: {
      // Proxy API requests to backend
      // Note: For network access, update this to use your local IP
      // Or set VITE_API_BASE_URL in .env to bypass proxy
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
