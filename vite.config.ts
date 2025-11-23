import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
// Attention needed here, there were some 403 in the browser so the following was modified
export default defineConfig({
	plugins: [sveltekit() as any, imagetools()],
	server: {
		// might not work in Production Environment but works in Development Environment
		proxy: {
			'/api': {
				target: 'https://api.revanced.app',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
