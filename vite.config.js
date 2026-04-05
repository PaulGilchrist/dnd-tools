import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dnd-tools/',
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
