import { ThemeConfig } from "tailwindcss/types/config";

const navbarHeight = "60px";

export const styleTheme: Partial<ThemeConfig> = {
  colors: {
    primary: "#ddd",
    accent: "#345eeb",
    bglight: "#2f363e",
    bgprimary: {
      DEFAULT: "#2f363e", // "#f5f8fa"
      nav: "#1f262e", // white
    },
    bgsecondary: "#1f262e",
  },
  height: {
    navbar: navbarHeight,
  },
  padding: {
    navbar: navbarHeight,
  },
  margin: {
    navbar: navbarHeight,
  },
  boxShadow: {
    sidebar:
      "25px 25px 75px rgba(0, 0, 0, 0.25), 10px 10px 70px rgba(0, 0, 0, 0.25), inset 5px 5px 10px rgba(0, 0, 0, 0.5), inset 5px 5px 20px rgba(255, 255, 255, 0.2), inset 5px -5px 15px rgba(0,0,0,0.75)",
    light:
      "0 0 5px #345eeb, 0 0 10px #345eeb, 0 0 20px #345eeb, 0 0 30px #345eeb",
    "selected-inner":
      "5px 5px 5px rgba(0, 0, 0, 0.5), inset 2px 2px 3px rgba(255, 255, 255, 0.25), inset -3px -3px 5px rgba(0, 0, 0, 0.5)",
    "selected-outer":
      "5px 5px 7px rgba(0, 0, 0, 0.25), inset 2px 2px 3px rgba(255, 255, 255, 0.25), inset -3px -3px 5px rgba(0, 0, 0, 0.5)",
  },
};
