import { type Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import animate from 'tailwindcss-animate'
import reactariaplugin from 'tailwindcss-react-aria-components'


const tailwindConfig : Config = {
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/theme/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				brand: '#4f46e5', //indigo-600
				success: '#047857', //emerald-700
				warning: '#c2410c', //orange-700
				error:'#b91c1c', //red-700
			},
			gridTemplateRows: {
				'fr-0': '0fr', // used for vertical transitions
				'fr-1': '1fr', // used for vertical transitions
			},
			transitionProperty: {
				'grid-rows': 'grid-template-rows', // used for vertical transitions
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				'slide-out': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)' },
				},
				indybar: {
					'0%': {
						width: '0',
						marginLeft: '0',
						marginRight: '100%',
					},
					'50%': {
						width: '100%',
						marginLeft: '0',
						marginRight: '0',
					},
					'100%': {
						width: '0',
						marginLeft: '100%',
						marginRight: '0',
					},
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' },
				},
			},
			animation: {
				'caret-blink': 'caret-blink 1.2s ease-out infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-bottom-up': 'slide-up 0.1s ease-out',
				'slide-out-right': 'slide-out 0.2s ease-in',
				'spin-slow': 'spin 2s linear infinite',
				'indeterminate-bar': 'indybar linear infinite',
			},
			transitionDuration: {
				3000: '3000ms',
			},
		},
	},
	plugins: [
		reactariaplugin,
		animate,
		plugin(function ({ addComponents }) {
			addComponents({
				'.labelStyles': {
					'@apply text-sm font-semibold text-gray-600 leading-6 w-full tracking-wide': {},
				},
				'.focusVisibleRingStyles': {
					'@apply ring-offset-white outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2':
						{},
				},
				'.groupFocusVisibleRingStyles': {
					'@apply ring-offset-white outline-none group-focus-visible:ring-2 group-focus-visible:ring-brand group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white':
						{},
				},
			})
		}),
	],
}

export default tailwindConfig
