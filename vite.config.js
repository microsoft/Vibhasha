import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
  return {
  // Allow Azure to override the base while retaining GitHub Pages and local defaults.
  base: process.env.VITE_BASE || (isGitHubPages ? '/Vibhasha/' : '/'),
    plugins: [react()],
    build: {
      outDir: 'dist',
    },

  };
});