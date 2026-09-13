import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Actions(CI)에서만 '/WYDQaA/' base 사용, 그 외(Vercel, 로컬)에서는 '/'
  base: process.env.GITHUB_ACTIONS ? '/WYDQaA/' : '/'
})

