/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class", '[data-theme="dark"]'],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/flowbite-react/**/*.js",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
		container: {
			center: true,
			padding: "1.5rem",
		},
	},
	plugins: [require("daisyui"), require("flowbite/plugin")],
	daisyui: {
		themes: ["light", "dark"],
	},
};
