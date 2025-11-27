import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.app.json',
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'src/main.ts'),
      // Library name
      name: 'ShadowHTMLRenderer',
      // Build only ESM format
      formats: ['es'],
      // Output file name for ESM
      fileName: 'shadow-html-renderer',
    },
    rolldownOptions: {
      output: {
        // Preserve exports from the entry point
        exports: 'named',
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Clear the output directory before building
    emptyOutDir: true,
  },
})
