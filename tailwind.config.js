/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                gdpt: "#007c3d",
                gdptHover: "#006030",
                gdptBackground: "#09723D",
            },
        },
    },
    plugins: [],
};
