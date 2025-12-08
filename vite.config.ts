import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), Icons({ compiler: 'svelte' })],
	server: {
		proxy: {
			// to be removed in production
			// Proxy API requests to bypass CORS in development
			'/api/revanced': {
				target: 'https://api.ushie.dev/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/revanced/, ''),
				secure: true
			}
		}
	}
});
