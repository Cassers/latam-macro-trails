import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// base = nombre del repo para que los assets resuelvan en GitHub Pages
export default defineConfig({
  base: '/latam-macro-trails/',
  plugins: [svelte()],
});
