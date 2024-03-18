/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#4299EF"
            },
        }
    },
    plugins: [daisyui],
    daisyui: {
        themes: [],
    },
}

