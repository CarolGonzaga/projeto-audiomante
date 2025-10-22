import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)"],
                display: ["var(--font-cinzel)"],
            },
            fontSize: {
                xxs: ["0.2rem", "0.75rem"],
            },
        },
    },
    plugins: [],
};
export default config;
