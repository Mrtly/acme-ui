import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from '@/components/forms/inputs/Checkbox'
import { userEvent, within, expect } from '@storybook/test'

const meta: Meta<typeof Checkbox> = {
	title: 'Forms/Inputs/Checkbox',
	render: ({ ...args }) => (
		<Checkbox
			id="terms"
			value="terms"
			label={args.label}
			error={args.error}
			disabled={args.disabled}
			readOnly={args.readOnly}
			small={args.small}
			required={args.required}
			showOptional={args.showOptional}
		/>
	),
	args: {
		label: 'Accept terms and conditions',
		error: false,
		disabled: false,
		readOnly: false,
		small: false,
		required: false,
		showOptional: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const checkbox = canvas.getByRole('checkbox', {
			name: new RegExp(args.label, 'i'),
		})
		await expect(checkbox).toBeVisible()
		expect(checkbox).not.toBeChecked()
		if (args.disabled) {
			await expect(checkbox).toBeDisabled()
		} else {
			if (!args.readOnly) {
				await expect(checkbox).toBeEnabled()
				await userEvent.click(checkbox)
				await expect(checkbox).toBeChecked()
			}
		}
		if (args.readOnly) {
			await expect(checkbox).toHaveAttribute('aria-readonly', 'true')
			return
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(checkbox).toBeRequired()
		} else if (!args.required) {
			if (args.showOptional) {
				await expect(canvas.getByText('(optional)')).toBeInTheDocument()
			}
			expect(checkbox).not.toBeRequired()
		}
		checkbox.blur()
	},
}

export default meta

type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}
