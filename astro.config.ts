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
      // Font subsets stay separate cacheable files. Inlining the small
      // latin-ext/vietnamese blocks as data URIs would push them into the
      // render-blocking stylesheet and hide them from the coverage check.
      // Everything else keeps Vite's default inlining.
      assetsInlineLimit: (filePath: string) => (filePath.endsWith('.woff2') ? false : undefined),
    },
  },
});
