import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify'; // Import the adapter

// https://astro.build/config
export default defineConfig({
  output: 'server', // Set the output to server to enable SSR
  adapter: netlify(), // Add the Netlify adapter
});
