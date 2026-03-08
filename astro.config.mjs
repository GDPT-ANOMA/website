import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    integrations: [icon(), mdx(), react()],
    vite: {
        plugins: [tailwindcss()],
    },
    output: "server",
    adapter: node({
        mode: "standalone",
    }),
});
