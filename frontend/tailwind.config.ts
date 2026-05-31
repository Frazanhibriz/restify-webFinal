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
                restify: {
                    olive: '#6B7F60',
                    cream: '#FFFDF0',
                    'text-dark': '#1A1A1A',
                    'text-gray': '#717171',
                },
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
export default config;