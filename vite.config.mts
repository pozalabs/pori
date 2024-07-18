import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/// <reference types="vitest" />
export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    test: {
      globals: true,
      coverage: {
        include: ['./src/utils/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
      },
      setupFiles: ['./vitest.setup.js'],
    },
  };
});
