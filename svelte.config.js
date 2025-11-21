import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			strict: false
		}),
		alias: {
			// resolve TypeScript path alias errors for Svelte components and stores
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
