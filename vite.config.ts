import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],

    base: "/", // important for production stability

    server: {
      port: 3000,
      host: true,
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // ✅ FIXED
      },
    },

    // ❌ DO NOT use process.env in Vite
    define: {
      __GEMINI_API_KEY__: JSON.stringify(env.VITE_GEMINI_API_KEY),
    },
  };
});
