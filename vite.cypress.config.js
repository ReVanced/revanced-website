// import { sveltekit } from '@sveltejs/kit/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import replace from '@rollup/plugin-replace';
import path from 'path';

// vite config for cypress component/unit tests

// cypress is dumb and breaks with the sveltekit plugin, so we have to do this instead...
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
    svelte(),
    replace({
      delimiters: ['', ''],
      values: {
        // '$app/environment': '$lib/testing/environment-cy.js',
        '__SVELTEKIT_DEV__': false,
        '__SVELTEKIT_BROWSER__': true,
        '__SVELTEKIT_APP_VERSION_POLL_INTERVAL__': 0,
      }
    }),
  ],
  resolve: {
    alias: {
      '$lib': path.resolve('./src/lib'),
      '$app': path.resolve('./node_modules/@sveltejs/kit/src/runtime/app'),
    },
  },
};

export default config;
