import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			strict: false
		}),
		alias: {
			$components: 'src/lib/components',
			$assets: 'src/lib/assets',
			$types: 'src/lib/types.ts',
			$stores: 'src/lib/stores',
			$lib: 'src/lib',
			$layout: 'src/layout',
			$data: 'src/data',
			$util: 'src/util',
			$images: 'images'
		}
	}
};

export default config;
