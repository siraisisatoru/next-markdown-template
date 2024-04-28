import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./Notes/**/*.{js,ts,jsx,tsx,mdx,md}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    daisyui: {
        themes: [
            {
                light: {
                    ...require("daisyui/src/theming/themes")["emerald"],
                    "--border-wiki": "#cbd5e1",
                },
            },
            {
                dark: {
                    ...require("daisyui/src/theming/themes")["dim"],
                    "--border-wiki": "#64748b",
                },
            },
        ],
    },
    darkMode: ["selector", '[data-theme="dark"]'],
};
export default config;
