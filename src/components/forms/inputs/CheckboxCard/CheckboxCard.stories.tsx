import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CheckboxCard } from './CheckboxCard'
import { userEvent, within, expect } from '@storybook/test'

const meta: Meta<typeof CheckboxCard> = {
	title: 'Forms/Inputs/CheckboxCard',
	render: ({ ...args }) => (
		<div className="w-1/2">
			<CheckboxCard
				id="terms"
				value="terms"
				label={args.label}
				error={args.error}
				disabled={args.disabled}
				readOnly={args.readOnly}
				required={args.required}
				showOptional={args.showOptional}
				rightSlot={args.rightSlot}
				rowReverse={args.rowReverse}
				colReverse={args.colReverse}
			>
				description
			</CheckboxCard>
		</div>
	),
	args: {
		label: 'Accept terms and conditions',
		error: false,
		disabled: false,
		readOnly: false,
		required: false,
		showOptional: false,
		rightSlot: '',
		rowReverse: false,
		colReverse: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const checkboxCard = canvas.getByRole('checkbox', {
			name: new RegExp(args.label, 'i'),
		})
		await expect(checkboxCard).toBeVisible()
		expect(checkboxCard).not.toBeChecked()
		if (args.disabled) {
			await expect(checkboxCard).toBeDisabled()
		} else {
			await expect(checkboxCard).toBeEnabled()
			await userEvent.click(checkboxCard)
			await expect(checkboxCard).toBeChecked()
			checkboxCard.blur()
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(checkboxCard).toBeRequired()
		} else if (!args.required) {
			if (args.showOptional) {
				await expect(canvas.getByText('(optional)')).toBeInTheDocument()
			}
			expect(checkboxCard).not.toBeRequired()
		}
	},
}

export default meta

type Story = StoryObj<typeof CheckboxCard>

export const Default: Story = {}
