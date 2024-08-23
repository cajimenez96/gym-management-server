const { build } = require('esbuild');

build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outdir: './dist',
  sourcemap: true,
  tsconfig: './tsconfig.json',
  external: ['express'], // Externalize Express to avoid bundling it
  minify: false,
}).catch(() => process.exit(1));
