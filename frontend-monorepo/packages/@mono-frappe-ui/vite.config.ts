import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { lucideIcons } from './vite/lucideIcons'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue(), lucideIcons()],
	resolve: {
		alias: {
			"tailwind.config.js": path.resolve(__dirname, "tailwind.config.js"),
		},
	},
	optimizeDeps: {
		include: ["tailwind.config.js"],
	},
});
