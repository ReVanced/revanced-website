import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	plugins: [sveltekit(), Icons({ compiler: 'svelte' })]
	,
	server: {
		proxy: {
			// to be removed in production
			// Proxy API requests to bypass CORS in development
			'/api/revanced': {
				target: 'https://api.revanced.app/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api\/revanced/, ''),
				secure: true
			}
		}
	}
});
