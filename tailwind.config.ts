import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: "#000000",
                ocean: "#333333",
                teal: "#FFFFFF",
                light: "#F9F9F9",
                muted: "#888888"
            },
            fontFamily: {
                serif: ["Cambria", "Fraunces", "serif"],
                sans: ["Inter", "Calibri", "sans-serif"],
            }
        },
    },
    plugins: [],
};
export default config;
