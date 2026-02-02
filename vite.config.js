import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    // Use '/' for private repo GitHub Pages (silver-carnival-*.pages.github.io)
    // Change to '/Vibhasha/' if deploying to microsoft.github.io/Vibhasha
    base: '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },

  };
});