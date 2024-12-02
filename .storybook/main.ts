import { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: [
		'../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'../src/theme/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],

	addons: [
		{
			name: '@storybook/addon-essentials',
			options: {
				actions: false,
			},
		},
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-coverage',
		'@storybook/experimental-addon-test',
	],

	framework: '@storybook/react-vite',
}
export default config
