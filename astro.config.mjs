import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import icon from "astro-icon";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    integrations: [icon(), tailwind(), mdx(), react()],
    output: "server",
    adapter: node({
        mode: "standalone",
    }),
});
