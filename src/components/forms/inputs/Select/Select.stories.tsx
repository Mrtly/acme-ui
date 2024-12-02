import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Select, SelectContent, SelectItem, SelectSection, SelectTrigger } from './Select'
import { within, expect } from '@storybook/test'

const meta: Meta = {
	title: 'Forms/Inputs/Select',
	render: ({
		label,
		srOnlyLabel,
		placeholder,
		error,
		disabled,
		readOnly,
		small,
		required,
		showOptional,
		showTrueValue,
		canClearSelection,
	}) => (
		<Select
			label={label}
			srOnlyLabel={srOnlyLabel}
			showOptional={showOptional}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
			placeholder={placeholder}
			onSelectionChange={(v) => console.log(v)}
			className="w-44"
		>
			{/* showTrueValue will show the value of selected item on Select element */}
			<SelectTrigger id="select-" error={error} showTrueValue={showTrueValue} small={small} />

			{/* maxHeight of the dropdown area */}
			<SelectContent maxHeight={240} canClearSelection={canClearSelection}>
				{/* optional section with title */}
				<SelectSection title="category 1">
					{/* value required, it is the submitted value */}
					<SelectItem value="chocolate">Chocolate</SelectItem>
					<SelectItem value="mint">Mint</SelectItem>
					<SelectItem value="strawberry">Strawberry</SelectItem>
				</SelectSection>

				<SelectSection title="category 2">
					<SelectItem value="vanilla">
						{/* long item to demo truncate */}
						Vanilla Vanilla Vanilla
					</SelectItem>
					<SelectItem value="lemon">Lemon Sorbet</SelectItem>
					<SelectItem value="pistachio">Pistachio</SelectItem>
				</SelectSection>

				<SelectItem value="cookies">Cookies</SelectItem>
			</SelectContent>
		</Select>
	),
	args: {
		label: 'Ice cream flavor',
		placeholder: 'Select flavor',
		srOnlyLabel: false,
		error: false,
		disabled: false,
		readOnly: false,
		required: true,
		showOptional: true,
		showTrueValue: false,
		small: false,
		canClearSelection: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const select = canvas.getByLabelText(/Ice cream flavor/i)
		await expect(select).toBeVisible()
		await expect(select).toHaveAccessibleName()
		if (args.placeholder) {
			const placeholder = canvas.getByText(args.placeholder)
			await expect(placeholder).toBeVisible()
		}
		await expect(select).toHaveAttribute('aria-expanded', 'false')
		if (args.required) {
			await expect(select.parentElement).toHaveAttribute('data-required', 'true')
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()

			await expect(select).toHaveAttribute(
				'aria-label',
				args.readOnly ? 'Ice cream flavor, required, read-only' : 'Ice cream flavor, required'
			)
		} else if (!args.required) {
			if (args.showOptional) {
				await expect(canvas.getByText('(optional)')).toBeInTheDocument()
			}
			expect(select).not.toHaveAttribute('aria-label', 'Ice cream flavor, required.')
		}
		args.disabled && !args.readOnly
			? await expect(select).toBeDisabled()
			: expect(select).not.toBeDisabled()
		args.readOnly
			? await expect(select).toHaveAttribute('data-readonly', 'true')
			: expect(select).not.toHaveAttribute('data-readonly', 'true')
	},
}

export default meta

type Story = StoryObj<typeof Select>

export const Default: Story = {}
