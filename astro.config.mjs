import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
	site: 'https://www.paramountworldrecords.com',
	output: 'hybrid',
	// Avoid Sharp in serverless bundles (often fails on Vercel Linux); site does not rely on Astro image optimization.
	adapter: vercel({
		imageService: false,
	}),
	vite: {
		ssr: {
			noExternal: ['resend'],
		},
	},
});
