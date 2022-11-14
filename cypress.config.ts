import { defineConfig } from 'cypress'
import config from './vite.cypress.config';

export default defineConfig({
  "component": {
    "devServer": {
      "framework": "svelte",
      "bundler": "vite",
      "viteConfig": config,
    }
  }
})
