import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		// adapter-static has vercel detection, but that does not let you set a custom 404 page easily.
		// Instead, we have to use a wrapper that generates a vercel config if on vercel...
		adapter: adapter({
			pages: 'public',
			fallback: '404.html'
		}),
		env: {
			publicPrefix: 'RV'
		}
	}
};

export default config;
