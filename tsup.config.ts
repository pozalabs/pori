import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    components: 'src/components/index.ts',
    utils: 'src/utils/index.ts',
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
  onSuccess: 'node ./.scripts/import-css.js && sh ./.scripts/declare-type.sh',
  esbuildOptions: options => {
    options.loader = {
      '.ts': 'tsx',
      '.tsx': 'tsx',
    };
    options.jsx = 'automatic';
  },
});
