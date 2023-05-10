// file: ./bundle-worker.mjs
import { build } from 'esbuild';

await build({
	entryPoints: ['./src/client/entry-worker.ts'],
	bundle: true,
	minify: true,
	format: 'iife',
	tsconfig: 'tsconfig.worker.json',
	outfile: './public/search-worker.js',
});
