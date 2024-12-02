import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextInput } from '@/components/forms/inputs/TextInput'
import { userEvent, within, expect } from '@storybook/test'

const meta: Meta<typeof TextInput> = {
	title: 'Forms/Inputs/TextInput',
	render: ({ ...args }) => (
		<div className="max-w-sm">
			<TextInput
				id="first-name"
				label={args.label}
				srOnlyLabel={args.srOnlyLabel}
				placeholder="Your name"
				autoComplete="name"
				error={args.error}
				disabled={args.disabled}
				readOnly={args.readOnly}
				small={args.small}
				required={args.required}
				showOptional={args.showOptional}
			/>
		</div>
	),
	args: {
		label: 'First Name',
		srOnlyLabel: false,
		error: false,
		disabled: false,
		readOnly: false,
		small: false,
		required: false,
		showOptional: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const input = canvas.getByLabelText(new RegExp(args.label, 'i'))
		await expect(input).toBeInTheDocument()
		await expect(input).toHaveAccessibleName()
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(input).toBeRequired()
		} else if (!args.required) {
			if (args.showOptional) {
				await expect(canvas.getByText('(optional)')).toBeInTheDocument()
			}
			expect(input).not.toBeRequired()
		}
		if (args.disabled) {
			await expect(input).toBeDisabled()
		} else if (args.readOnly) {
			await expect(input).toHaveAttribute('readOnly')
		} else {
			expect(input).not.toBeDisabled()
			await userEvent.type(input, 'James')
			await expect(input).toHaveValue('James')
			await userEvent.clear(input)
			expect(input).not.toHaveValue()
			input.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof TextInput>

export const Default: Story = {}
