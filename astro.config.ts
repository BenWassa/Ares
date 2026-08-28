import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://benwassa.github.io',
  base: '/Ares',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  vite: {
    build: {
      target: 'es2022',
    },
  },
});
