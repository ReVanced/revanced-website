import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools'

import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), imagetools()],
  resolve: {
    alias: {
      '$images': path.resolve('./images'),
    },
  },
};

export default config;
