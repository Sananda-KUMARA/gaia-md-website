import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
       primary: {
          DEFAULT: '#3B82F6', // Couleur principale du bouton de scroll !!! à améliorer 
          dark: '#2563EB',    // Version plus foncée pour hover du bouton de scroll, à améliorer 
          background: "var(--background)",
          foreground: "var(--foreground)",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
