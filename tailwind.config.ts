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
                navy: "#21295C",
                ocean: "#065A82",
                teal: "#1C7293",
                light: "#F4F8FA",
                muted: "#5B6B75"
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
