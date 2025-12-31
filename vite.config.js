import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Updated to trigger restart for react-hot-toast
export default defineConfig({
  plugins: [react()],
})
