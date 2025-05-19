export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './packages/ui/**/*.{js,ts,jsx,tsx}', './locales/**/*.json', './src/styles/globals.css'],
  theme: {
    // Расширения темы теперь обрабатываются в globals.css через @theme
  },
  plugins: ['@tailwindcss/typography', '@tailwindcss/forms', 'tailwindcss-animate'],
};