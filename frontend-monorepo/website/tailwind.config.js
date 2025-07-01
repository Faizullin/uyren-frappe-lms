import frappeUIPreset from '@mono/mono-frappe-ui/src/tailwind/preset'

/** @type {import('tailwindcss').Config} */
export default {
	presets: [frappeUIPreset],
  content: [
    './index.html',
     './src/**/*.{vue,js,ts,jsx,tsx}',
     "../packages/@mono-frappe-ui/src/**/*.{vue,js,ts,jsx,tsx}",
      "../packages/@mono-frappe-ui/frappe/**/*.{vue,js,ts,jsx,tsx}",
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

