/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                gdpt: {
                    DEFAULT: "#007c3d",
                    100: "#cce5d8",
                    200: "#99cbb1",
                    300: "#66b08b",
                    400: "#339664",
                    500: "#007c3d",
                    600: "#006331",
                    700: "#004a25",
                    800: "#003218",
                    900: "#00190c",
                },
                gdptHover: "#006030",
                gdptBackground: "#09723D",
                grayish: "#eaeef7",
                grayBackground: "#262626",

            },
        },
    },
    plugins: [require("tailwindcss-animate"), require('daisyui')],
    
};

