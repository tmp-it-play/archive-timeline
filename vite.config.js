import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    dedupe: [
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/language',
      '@codemirror/commands',
      '@codemirror/autocomplete',
      '@codemirror/lang-html',
      '@codemirror/lang-sql',
      '@codemirror/lang-java',
      '@codemirror/theme-one-dark',
      '@lezer/common',
      '@lezer/lr',
      '@lezer/highlight',
      '@lezer/html',
      '@lezer/css',
      '@lezer/javascript',
      '@lezer/java',
    ],
  },
  optimizeDeps: {
    // lezer 패키지들을 pre-bundle에서 제외 → 단일 ESM 인스턴스 보장
    exclude: [
      '@codemirror/lang-html',
      '@codemirror/lang-sql',
      '@codemirror/lang-java',
      '@lezer/html',
      '@lezer/css',
      '@lezer/javascript',
      '@lezer/java',
      '@lezer/lr',
      '@lezer/common',
      '@lezer/highlight',
    ],
    include: [
      '@codemirror/state',
      '@codemirror/view',
      '@codemirror/language',
      '@codemirror/commands',
      '@codemirror/autocomplete',
      '@codemirror/theme-one-dark',
    ],
  },
})
