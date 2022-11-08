import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import replace from '@rollup/plugin-replace';

export default defineConfig({
  plugins: [
    // `$app/environment` has skill issues
    replace({
      delimiters: ['', ''],
      values: {
        '$app/environment': '$lib/testing/environment.js'
      }
    }),
    sveltekit(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
