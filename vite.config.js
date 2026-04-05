import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the base path from package.json homepage
const packageJson = await import('./package.json')
const homepage = packageJson.default?.homepage || ''
const base = homepage ? new URL(homepage).pathname : '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dnd-tools-react/',
  optimizeDeps: {
    include: ['lodash']
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (chunkInfo) => {
          // Don't hash image files - keep original names for faster deployments
          if (chunkInfo.type === 'asset' && chunkInfo.name && /\.(jpg|jpeg|png|gif|webp)$/i.test(chunkInfo.name)) {
            return `assets/${chunkInfo.name}`;
          }
          return 'assets/[name].[ext]';
        }
      }
    },
    copyPublicDir: true,
    outDir: 'dist',
    emptyOutDir: true
  }
})
