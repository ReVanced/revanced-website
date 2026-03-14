import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$assets: 'src/lib/assets',
			$types: 'src/lib/types.ts',
			$stores: 'src/lib/stores',
			$api: 'src/lib/api',
			$lib: 'src/lib'
		},
		env: {
			publicPrefix: 'RV_'
		}
	}
};

export default config;
