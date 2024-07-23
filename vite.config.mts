import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/// <reference types="vitest" />
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environmentMatchGlobs: [
      ['./src/utils/**/*.{test,spec}.?(c|m)[jt]s?(x)', 'node'],
      ['./src/components/**/*.{test,spec}.?(c|m)[jt]s?(x)', 'jsdom'],
    ],
    coverage: {
      include: ['./src/utils/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    },
    setupFiles: ['./vitest.setup.js'],
  },
});
