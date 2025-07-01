import frappeUIPreset from '@mono/frappe-ui/src/tailwind/preset'

/** @type {import('tailwindcss').Config} */
export default {
	presets: [frappeUIPreset],
  content: [
    './index.html',
     './src/**/*.{vue,js,ts,jsx,tsx}',
     "../packages/frappe-ui/src/components/**/*.{vue,js,ts,jsx,tsx}",
      "../packages/frappe-ui/frappe/**/*.{vue,js,ts,jsx,tsx}",
  ],
	theme: {
		extend: {
			strokeWidth: {
				1.5: '1.5',
			},
			screens: {
				'2xl': '1600px',
				'3xl': '1920px',
			},
		},
	},
	plugins: [],
}

