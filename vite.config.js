import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves a project repo from /<repo-name>/, not from the domain root.
// Leave `base` at '/' and every asset 404s — the page loads white with no error in the
// UI and only a console full of missing files, which is the single most common way a
// Vite build "works locally and is broken when published".
//
// Set BASE_PATH when building for a project page:
//     BASE_PATH=/akmaz-site/ npm run build
// Leave it unset for a custom domain (akmaz.eu), where the site IS at the root.
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    // Tailwind 4 runs as a Vite plugin. There is no tailwind.config.js and no PostCSS
    // step: design tokens live in src/index.css under @theme. Following a v3 tutorial
    // here produces a build that compiles and ships zero styles.
    tailwindcss(),
  ],
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        // Animation libraries are heavy and change rarely — splitting them keeps the
        // main chunk small enough that the hero paints before they finish downloading.
        //
        // NB the function form. Vite 8 bundles with Rolldown, not Rollup, and Rolldown
        // rejects the object form that every tutorial still shows:
        //     TypeError: manualChunks is not a function
        // The build fails outright, so this is not a subtle difference — but it only
        // surfaces on `npm run build`, never in dev.
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'gsap'
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion'
          return undefined
        },
      },
    },
  },
})
