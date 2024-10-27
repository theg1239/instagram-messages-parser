import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
        'input-bg': 'var(--input-bg)',
        'input-text': 'var(--input-text)',
        'box-border': 'var(--box-border)',
        'scrollbar-track': 'var(--scrollbar-track)',
        'scrollbar-thumb': 'var(--scrollbar-thumb)',
      },
    },
  },
  plugins: [],
}
export default config
