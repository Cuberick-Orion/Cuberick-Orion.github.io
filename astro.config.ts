import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  // site: THEME_CONFIG.website,
  site: 'https://zheyuanliu.me',
  // base: '/personal_homepage_astro_typography',
  prefetch: true,
  markdown: {
    shikiConfig: {
      themes: {
        light: 'min-light',
        dark: 'one-dark-pro',
      },
      langs: [],
      wrap: true,
    },
  },
  integrations: [
    UnoCSS({
      injectReset: true
    }),
    robotsTxt(),
    sitemap(),
    mdx()
  ]
});
