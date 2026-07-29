import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Yeh line saari deprecation warnings ko band kar degi
        silenceDeprecations: ['global-builtin', 'color-functions', 'import'],
      },
    },
  },
})