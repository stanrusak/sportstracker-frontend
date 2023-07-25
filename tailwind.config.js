import { styleTheme } from "./styles";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: styleTheme,
  },
  plugins: [require("@tailwindcss/forms")],
};
