import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
  base: "/cultureCompass_test/", // 例如你的仓库叫 'my-project'，这里就写 '/my-project/'
  plugins: [react()],
});
