import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vercel 배포 시에는 '/', GitHub Pages 배포 시에는 '/WYDQaA/' 또는 상대경로 './' 적용
  base: process.env.VERCEL ? '/' : './'
})

