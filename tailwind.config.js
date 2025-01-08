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
                textColorDark: "#e5e5e5",
                textColor: {
                    DEFAULT: "#e5e5e5",
                    100: "#fafafa",
                    200: "#f5f5f5",
                    300: "#efefef",
                    400: "#eaeaea",
                    500: "#e5e5e5",
                    600: "#b7b7b7",
                    700: "#898989",
                    800: "#5c5c5c",
                    900: "#2e2e2e",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
