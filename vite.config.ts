import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // Tillåt externa anslutningar
    open: true, // Öppna webbläsare automatiskt
    // Säkerhetsheaders för utvecklingsserver
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  },
  build: {
    // Säkerhetsoptimering för produktion
    minify: 'esbuild', // Använd esbuild istället för terser
    target: 'es2020',
    sourcemap: false, // Inaktivera sourcemaps i produktion
    rollupOptions: {
      output: {
        // Förhindra att känslig information läcker genom filnamn
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  // Optimeringar för utveckling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // CSS-optimering
  css: {
    postcss: './postcss.config.js'
  }
})
