import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/lib/components',
			$api: './src/lib/api',
			$lib: './src/lib',
			$types: './src/lib/types.d.ts',
			$stores: './src/lib/stores.ts'
		}
	}
};

export default config;
