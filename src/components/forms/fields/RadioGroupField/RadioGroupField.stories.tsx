import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { RadioGroupField, RadioGroupFieldItem } from '@/forms/fields/RadioGroupField'

import { userEvent, within, expect } from '@storybook/test'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'

const FormSchema = z.object({
	test_radiogroup: z.enum(['dog', 'cat', 'dragon'], {
		required_error: 'Select a pet.',
	}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

type FieldDemoProps = {
	legend: string
	description: string
	srOnlyDescription?: boolean
	srOnlyLegend?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	orientation?: 'vertical' | 'horizontal'
}

const RadioGroupFieldDemo = ({
	legend,
	description,
	srOnlyDescription,
	srOnlyLegend,
	disabled,
	readOnly,
	required,
	orientation,
}: FieldDemoProps) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div className="max-w-sm">
			<Form
				formMethods={form}
				formName="radio group form"
				onSubmit={onSubmit}
				className="flex flex-col gap-2"
			>
				<RadioGroupField
					control={form.control}
					name="test_radiogroup"
					legend={legend}
					description={description}
					srOnlyDescription={srOnlyDescription}
					srOnlyLegend={srOnlyLegend}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					orientation={orientation}
				>
					<RadioGroupFieldItem id="dog" value="dog" label="Dog" />
					<RadioGroupFieldItem id="cat" value="cat" label="Cat" />
					<RadioGroupFieldItem id="dragon" value="dragon" label="Dragon" />
				</RadioGroupField>
				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof RadioGroupFieldDemo> = {
	title: 'Forms/Fields/RadioGroupField',
	render: ({ ...args }) => (
		<RadioGroupFieldDemo
			legend={args.legend}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			srOnlyLegend={args.srOnlyLegend}
			disabled={args.disabled}
			readOnly={args.readOnly}
			required={args.required}
			orientation={args.orientation}
		/>
	),
	args: {
		legend: 'Choose your pet',
		description: 'Praesent commodo cursus magna.',
		srOnlyDescription: false,
		srOnlyLegend: false,
		disabled: false,
		readOnly: false,
		required: true,
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
		expect(radioGroup).toHaveAccessibleName()
		if (args.orientation === 'horizontal') {
			expect(radioGroup).toHaveClass('flex-row flex-wrap')
			expect(radioGroup).toHaveAttribute('aria-orientation', 'horizontal')
		}
		if (args.orientation === 'vertical') {
			expect(radioGroup).toHaveClass('flex-col')
			expect(radioGroup).toHaveAttribute('aria-orientation', 'vertical')
		}
		if (args.description) {
			expect(radioGroup).toHaveAccessibleDescription()
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			expect(radioGroup).toBeRequired()
		} else if (!args.required) {
			expect(canvas.getByText('(optional)')).toBeInTheDocument()
			expect(radioGroup).not.toBeRequired()
		}
		if (args.disabled) {
			expect(radioGroup).toHaveAttribute('aria-disabled', 'true')
			return
		} else if (args.readOnly) {
			expect(radioGroup).toHaveAttribute('aria-readonly', 'true')
			return
		}
		const radioDog = canvas.getByLabelText('Dog')
		expect(radioDog).toHaveAccessibleName()
		expect(radioDog).toHaveAttribute('value', 'dog')
		expect(radioDog).not.toBeChecked()
		const radioCat = canvas.getByLabelText('Cat')
		expect(radioCat).not.toBeChecked()

		await userEvent.click(radioCat)
		expect(radioCat).toBeChecked()
		radioCat.blur()
	},
}

export default meta

type Story = StoryObj<typeof RadioGroupFieldDemo>

export const Default: Story = {}
