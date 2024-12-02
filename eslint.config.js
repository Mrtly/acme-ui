import eslintJS from '@eslint/js'
import tsEslint from 'typescript-eslint'
import sbEslint from 'eslint-plugin-storybook'
import twEslint from 'eslint-plugin-tailwindcss'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
	eslintJS.configs.recommended,
	...tsEslint.configs.recommended,
	...sbEslint.configs['flat/recommended'],
	...twEslint.configs['flat/recommended'],
	{
		plugins: {
			react: react,
			reactHooks: reactHooks,
		},
		settings: {
			react: {
				version: 'detect',
			},
			tailwindcss: {
				callees: ['classnames', 'cva', 'clsx', 'cn'],
			},
		},
		rules: {
			'tailwindcss/classnames-order': 'off',
			'@typescript-eslint/no-unused-expressions': 'off', //this trips up on conditionals with &&
		},
	
	},
  {
    ignores: [
      '.next',
      '.storybook',
      '.vscode',
      'coverage',
      'dist',
      'kubernetes',
      'node_modules',
      'pipelines',
      'storybook-static',
			'*.config.*', // ignore all config files
		]
  }
]
