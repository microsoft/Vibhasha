import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'
  return {
    // Resolves to '/Vibhasha/' under GITHUB_ACTIONS, '/' locally so dev preview still works.
    base: isGitHubPages ? '/Vibhasha/' : '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
    },

  };
});