import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, Radio } from '@/components/forms/inputs/RadioGroup'
import { within, expect, userEvent } from '@storybook/test'

const meta: Meta<typeof RadioGroup> = {
	title: 'Forms/Inputs/RadioGroup',
	render: ({ ...args }) => (
		<RadioGroup
			legend="Favorite pet"
			defaultValue="cat"
			error={args.error}
			disabled={args.disabled}
			readOnly={args.readOnly}
			required={args.required}
			showOptional={args.showOptional}
			srOnlyLegend={args.srOnlyLegend}
			orientation={args.orientation}
			name="pets"
		>
			<Radio id="dog" value="dog" label="Dog" />
			<Radio id="cat" value="cat" label="Cat" />
			<Radio id="dragon" value="dragon" label="Dragon" />
		</RadioGroup>
	),
	args: {
		error: false,
		disabled: false,
		readOnly: false,
		required: false,
		showOptional: false,
		srOnlyLegend: false,
		orientation: 'vertical',
	},
	argTypes: {
		orientation: {
			options: ['horizontal', 'vertical'],
			control: {
				type: 'radio',
			},
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const radioGroup = canvas.getByRole('radiogroup', {
			name: new RegExp(args.legend, 'i'),
		})
		await expect(radioGroup).toHaveAccessibleName()
		if (args.orientation === 'horizontal') {
			await expect(radioGroup).toHaveClass('flex-row flex-wrap')
			await expect(radioGroup).toHaveAttribute('aria-orientation', 'horizontal')
		}
		if (args.orientation === 'vertical') {
			await expect(radioGroup).toHaveClass('flex-col')
			await expect(radioGroup).toHaveAttribute('aria-orientation', 'vertical')
		}
		if (args.required) {
			await expect(radioGroup).toBeRequired()
		} else if (!args.required) {
			expect(radioGroup).not.toBeRequired()
		}
		if (args.disabled) {
			await expect(radioGroup).toHaveAttribute('aria-disabled', 'true')
			return
		}
		if (args.readOnly) {
			await expect(radioGroup).toHaveAttribute('aria-readonly', 'true')
			return
		}
		const cat = canvas.getByLabelText('Cat')
		await expect(cat).toHaveAccessibleName()
		await expect(cat).toHaveAttribute('value', 'cat')
		await expect(cat).toBeChecked()
		const dragon = canvas.getByLabelText('Dragon')
		await expect(dragon).toHaveAccessibleName()
		await expect(dragon).toHaveAttribute('value', 'dragon')
		await userEvent.click(dragon)
		expect(cat).not.toBeChecked()
		await expect(dragon).toBeChecked()
	},
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {}
