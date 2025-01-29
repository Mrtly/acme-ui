import type { Preview } from '@storybook/react'
import '../src/styles.css'

const preview: Preview = {
	parameters: {
		docs: {
			// theme: Theme,
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
}

export default preview
