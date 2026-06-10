/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Design tokens — miroir de l'objet `C` dans src/lib/constants.js
      colors: {
        bg: "#09090F", bg2: "#0F111A", bg3: "#161928", bg4: "#1E2137",
        border: "rgba(255,255,255,0.06)", border2: "rgba(255,255,255,0.11)",
        text1: "#ECEDF8", text2: "#8C91AD", text3: "#464C6A",
        accent: "#6366F1", accentL: "rgba(99,102,241,0.14)", accentT: "rgba(99,102,241,0.03)",
        purple: "#A78BFA", purpleL: "rgba(167,139,250,0.12)",
        teal: "#2DD4BF", tealL: "rgba(45,212,191,0.12)",
        green: "#34D399", greenL: "rgba(52,211,153,0.12)",
        amber: "#FBBF24", amberL: "rgba(251,191,36,0.12)",
        red: "#F87171", redL: "rgba(248,113,113,0.12)",
        pink: "#F472B6", gold: "#C9A84C", gold2: "#E8C97A",
      },
      backgroundImage: {
        brand: "linear-gradient(135deg,#6366F1,#A78BFA)",
        brand2: "linear-gradient(135deg,#6366F1,#2DD4BF)",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      keyframes: {
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        blink: "blink 1s infinite",
        fadeUp: "fadeUp .5s ease both",
      },
    },
  },
  plugins: [],
};
