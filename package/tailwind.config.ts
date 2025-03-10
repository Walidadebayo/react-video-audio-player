import type { Config } from "tailwindcss";

const config: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class',
  corePlugins: {
    preflight: false,
  },
}

export default config;