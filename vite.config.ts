import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [sveltekit(), Icons({ compiler: 'svelte' }), imagetools()]
});
