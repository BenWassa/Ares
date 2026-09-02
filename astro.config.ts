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
      //
      // Client scripts stay separate for the same reason (#51): the screen
      // hierarchy turned a handful of long routes into many short ones, and an
      // inlined enhancement script is re-downloaded on every one of them. One
      // cached file is smaller for a reader who moves through the hierarchy and
      // smaller in the build budget. Everything else keeps Vite's default.
      assetsInlineLimit: (filePath: string) => (/\.(?:woff2|js)$/.test(filePath) ? false : undefined),
    },
  },
});
