// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],

  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.strapiapp.com',
      },
      {
        protocol: 'https',
        hostname: '**.strapi.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
    ],
  },
});