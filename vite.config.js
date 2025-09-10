import { defineConfig } from 'vite';

export default defineConfig({
  // Base public path
  base: './',
  
  // Development server configuration
  server: {
    port: 8000,
    host: true,
    open: true
  },
  
  // Preview server configuration
  preview: {
    port: 8000,
    host: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    
    // Rollup options for advanced configuration
    rollupOptions: {
      output: {
        // Separate vendor chunks for better caching
        manualChunks: {
          'three': ['three'],
          'three-loaders': ['three/examples/jsm/loaders/FBXLoader']
        }
      }
    },
    
    // Copy public assets
    copyPublicDir: true
  },
  
  // Public directory
  publicDir: 'public',
  
  // Asset handling
  assetsInclude: ['**/*.fbx', '**/*.gltf', '**/*.glb']
});