import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
  return {
    base: isGitHubPages ? '/Vibhasha/' : '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },

  };
});