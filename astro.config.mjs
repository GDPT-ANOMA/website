import { defineConfig, envField } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  env: {
    schema: {
      SMTP_HOST: envField.string({ context: "server", access: "secret", optional: true }),
      SMTP_PORT: envField.number({
        context: "server",
        access: "secret",
        optional: true,
        default: 465,
        int: true,
      }),
      SMTP_USER: envField.string({ context: "server", access: "secret", optional: true }),
      SMTP_PASS: envField.string({ context: "server", access: "secret", optional: true }),
      CONTACT_EMAIL_TO: envField.string({ context: "server", access: "secret", optional: true }),
      GOOGLE_CALENDAR_API_KEY: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      GOOGLE_CALENDAR_ID: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
    },
  },
});
