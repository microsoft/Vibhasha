import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  return {
    // Use '/Vibhasha/' for GitHub Pages, '/' for Azure App Service
    base: process.env.VITE_BASE || '/Vibhasha/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },

  };
});