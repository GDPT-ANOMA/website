import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [icon(), mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vn"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
