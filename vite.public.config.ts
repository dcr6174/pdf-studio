import vinext from 'vinext';
import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [vinext(), cloudflare({
    configPath: './wrangler.public.json',
    viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
    inspectorPort: false,
  })],
});
