import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy animation/runtime vendors into their own cacheable chunks
        // so the initial app chunk stays lean.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'vendor-gsap'
            if (id.includes('/motion') || id.includes('framer')) return 'vendor-motion'
            if (id.includes('lenis')) return 'vendor-lenis'
            if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) return 'vendor-react'
          }
          return undefined
        },
      },
    },
  },
})