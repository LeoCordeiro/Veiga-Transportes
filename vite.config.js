import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// base './' porque o site vai para Netlify em raiz, mas o build precisa abrir
// também por file:// na conferência local.
//
// Sem plugin PWA: incompatível com Node 24 e o site é institucional, não
// precisa de offline. Mesma decisão dos projetos irmãos.
export default defineConfig({
  base: './',
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5186 },
})
