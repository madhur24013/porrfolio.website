import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { imagetools } from 'vite-imagetools'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/porrfolio.website/",
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      deleteOriginalAssets: false,
    }),
    imagetools(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'framer-motion'],
          three: ['three'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    hmr: {
      overlay: true,
      protocol: 'ws',
      timeout: 1000,
    },
    warmup: {
      clientFiles: ['./src/main.jsx']
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'three', '@react-three/drei', '@react-three/fiber'],
    exclude: [],
    esbuildOptions: {
      target: 'esnext',
      treeShaking: true,
    },
  },
  assetsInclude: ['**/*.gltf', '**/*.glb'],
  css: {
    devSourcemap: false,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
