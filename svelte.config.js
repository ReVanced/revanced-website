import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

import { wrap } from './src/_vercel-moment.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// adapter-static has vercel detection, but that does not let you set a custom 404 page easily.
		// Instead, we have to use a wrapper that generates a vercel config if on vercel...
		adapter: wrap(adapter, {
			pages: "public",
			fallback: "404.html"
		}),
	}
};

export default config;
