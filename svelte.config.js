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
			$ui: 'src/lib/components/ui',
			$layout: 'src/lib/components/layout',
			$data: 'src/lib/data',
			$utils: 'src/lib/utils',
			$assets: 'src/lib/assets',
			$images: 'src/lib/assets/images',
			$types: 'src/lib/types.ts',
			$stores: 'src/lib/stores',
			$lib: 'src/lib'
		}
	}
};

export default config;
