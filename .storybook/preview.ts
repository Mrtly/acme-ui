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
		a11y: {
			//axe-core config options https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#parameters-1
			//https://react-spectrum.adobe.com/react-aria/Select.html#accessibility
			//https://react-spectrum.adobe.com/react-aria/accessibility.html#false-positives
			config: {
				rules: [
					{
						id: 'aria-hidden-focus',
						selector: 'body *:not([data-a11y-ignore="aria-hidden-focus"])',
					},
				],
			},
		},
	},
}

export default preview
