import { unlinkPlugin, postBuildProcessing } from '@logitech/plugin-toolkit';
import { esmShimPlugin } from '@logitech/plugin-toolkit/esbuild';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

const directory = dirname(fileURLToPath(import.meta.url));
const watchEnabled = process.argv.includes('--watch') || process.argv.includes('-w');

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  outDir: 'dist',
  outExtension: () => ({ js: '.mjs' }),
  clean: true,
  bundle: true,
  platform: 'node',
  target: 'node22',
  noExternal: [/.*/],
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  onSuccess: async () => {
    console.log('Finder plugin build completed.');
    await postBuildProcessing(directory, watchEnabled);
  },
  watch: watchEnabled,
  shims: true,
  esbuildPlugins: [esmShimPlugin({ require: true })],
});

if (watchEnabled) {
  const cleanup = async () => {
    try {
      await unlinkPlugin(true);
    } catch (error) {
      console.error('Failed to unlink Finder plugin:', error);
    }
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}
