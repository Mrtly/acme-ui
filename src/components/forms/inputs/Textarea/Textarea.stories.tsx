import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from '@/components/forms/inputs/Textarea'
import { userEvent, within, expect } from '@storybook/test'

const meta: Meta<typeof Textarea> = {
	title: 'Forms/Inputs/Textarea',
	render: ({ ...args }) => (
		<div className="max-w-sm">
			<Textarea
				id="message"
				label={args.label}
				srOnlyLabel={args.srOnlyLabel}
				placeholder="Type your message here."
				error={args.error}
				disabled={args.disabled}
				required={args.required}
				readOnly={args.readOnly}
				showOptional={args.showOptional}
			/>
		</div>
	),
	args: {
		label: 'Your message',
		srOnlyLabel: false,
		error: false,
		disabled: false,
		readOnly: false,
		required: false,
		showOptional: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const textArea = canvas.getByLabelText(new RegExp(args.label, 'i'))
		await expect(textArea).toBeInTheDocument()
		await expect(textArea).toHaveAccessibleName()
		await expect(textArea).toHaveAttribute('placeholder', 'Type your message here.')
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(textArea).toBeRequired()
		} else if (!args.required) {
			if (args.showOptional) {
				await expect(canvas.getByText('(optional)')).toBeInTheDocument()
			}
			expect(textArea).not.toBeRequired()
		}
		if (args.disabled) {
			await expect(textArea).toBeDisabled()
		} else if (args.readOnly) {
			await expect(textArea).toHaveAttribute('readonly')
		} else {
			expect(textArea).not.toBeDisabled()
			await userEvent.type(textArea, 'a new msg')
			await expect(textArea).toHaveValue('a new msg')
			await userEvent.clear(textArea)
			expect(textArea).not.toHaveValue()
			textArea.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Default: Story = {}
