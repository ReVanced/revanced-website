import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [sveltekit(), Icons({ compiler: 'svelte' }), imagetools()],
	server: {
		host: true, // Listen on all network interfaces
		port: 5173,
		strictPort: false,
		cors: true
	}
});
// Only for testing firewall rules, should be removed in production