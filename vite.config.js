import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';

import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), imagetools()],
	resolve: {
		alias: {
			$images: path.resolve('./images'),
			$data: path.resolve('./src/data'),
			$layout: path.resolve('./src/layout'),
			$util: path.resolve('./src/util')
		}
	}
};

export default config;
