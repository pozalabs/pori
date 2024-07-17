import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    components: 'src/components/index.ts',
  },
  treeshake: true,
  sourcemap: 'inline',
  minify: true,
  clean: true,
  dts: true,
  splitting: true,
  outDir: './dist',
  format: ['cjs', 'esm'],
  external: ['react', 'react-dom'],
  esbuildOptions: options => {
    options.loader = {
      '.ts': 'tsx',
      '.tsx': 'tsx',
    };
    options.jsx = 'automatic';
  },
});
