import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    // Use '/Vibhasha/' for public repo GitHub Pages (microsoft.github.io/Vibhasha)
    base: '/Vibhasha/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },

  };
});