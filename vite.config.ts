import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    // Generate source maps for debugging production issues
    sourcemap: true,
    
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        }
      }
    },
    
    // Minification settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    chunkSizeWarningLimit: 1000, // Warn for chunks larger than 1000kb
    
    // Output directory
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Clear output directory before build
    emptyOutDir: true,
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: true,
    open: true,
  }
})
