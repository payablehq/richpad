import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const buildMode = process.env.BUILD_MODE // 'lib' | 'demo' | undefined (dev)

export default defineConfig({
  plugins: [react()],

  // ─── Demo app: serve/build from root with /richpad/ base for GitHub Pages ──
  base: buildMode === 'demo' ? '/richpad/' : '/',

  build: buildMode === 'lib'
    ? {
        // ─── Library build ─────────────────────────────────────────────────
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'RichPad',
          fileName: 'richpad',
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          // Only externalise React — everything else is bundled (batteries-included)
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
          },
        },
        // Emit CSS as richpad.css alongside the JS bundles
        cssCodeSplit: false,
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
      }
    : {
        // ─── Demo app build ─────────────────────────────────────────────────
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
      },
})
