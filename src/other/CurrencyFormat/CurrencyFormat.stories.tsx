import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CurrencyFormat } from './CurrencyFormat'

const meta: Meta = {
	title: 'Utility/CurrencyFormat',
	render: ({ ...args }) => <CurrencyFormat amount={args.amount} />,
	args: {
		amount: 1200.5,
	},
}

export default meta

export const Default: StoryObj = {}
