import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { SelectField, SelectFieldItem, SelectFieldSection } from './SelectField'
import { screen, userEvent, within, waitFor, expect } from '@storybook/test'

import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import { Button } from '@/components/buttons/Button'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'

const FormSchema = z.object({
	test_select: z
		.string({
			required_error: 'Select a flavor.',
		})
		//important if the Select field has the clear value item (sets value to "")
		.refine((data) => data.trim() !== '', {
			message: 'Select an option.',
		}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const SelectFieldDemo = ({
	label,
	srOnlyLabel,
	placeholder,
	description,
	srOnlyDescription,
	disabled,
	readOnly,
	canClearSelection,
	maxHeight,
	showTrueValue,
	required,
}: {
	label: string
	srOnlyLabel?: boolean
	placeholder: string
	description: string
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	maxHeight: number | undefined
	showTrueValue?: boolean
	required?: boolean
	canClearSelection?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<Form formMethods={form} formName="Select form" onSubmit={onSubmit} className="w-60">
				<SelectField
					control={form.control}
					name="test_select"
					id="test-select"
					label={label}
					srOnlyLabel={srOnlyLabel}
					description={description}
					placeholder={placeholder}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					maxHeight={maxHeight}
					showTrueValue={showTrueValue}
					required={required}
					canClearSelection={canClearSelection}
					defaultValue={form.watch('test_select')}
				>
					<SelectFieldItem value="chocolate">Chocolate</SelectFieldItem>
					<SelectFieldItem value="mint">Mint</SelectFieldItem>
					<SelectFieldItem value="strawberry">Strawberry</SelectFieldItem>

					<SelectFieldSection title="category 2">
						<SelectFieldItem value="vanilla">Vanilla</SelectFieldItem>
						<SelectFieldItem value="lemon">Lemon Sorbet</SelectFieldItem>
						<SelectFieldItem value="pistachio">Pistachio</SelectFieldItem>
					</SelectFieldSection>
				</SelectField>

				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

const meta: Meta<typeof SelectFieldDemo> = {
	title: 'Forms/Fields/SelectField',
	render: ({
		label,
		srOnlyLabel,
		placeholder,
		description,
		srOnlyDescription,
		disabled,
		readOnly,
		canClearSelection,
		maxHeight,
		showTrueValue,
		required,
	}) => (
		<SelectFieldDemo
			label={label}
			srOnlyLabel={srOnlyLabel}
			placeholder={placeholder}
			description={description}
			srOnlyDescription={srOnlyDescription}
			disabled={disabled}
			readOnly={readOnly}
			canClearSelection={canClearSelection}
			maxHeight={maxHeight}
			showTrueValue={showTrueValue}
			required={required}
		/>
	),
	args: {
		label: 'Ice cream flavor',
		placeholder: 'Select flavor',
		description: 'Select your ice cream flavor',
		srOnlyLabel: false,
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		canClearSelection: true,
		maxHeight: undefined,
		showTrueValue: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const select = canvas.getByLabelText(/Ice cream flavor/i)
		expect(select).toBeVisible()
		expect(select).toHaveAttribute('aria-expanded', 'false')
		expect(select).toHaveAccessibleName()
		if (args.description) {
			expect(select).toHaveAccessibleDescription()
		}
		if (args.required) {
			expect(select.parentElement).toHaveAttribute('data-required', 'true')
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			expect(select).toHaveAttribute(
				'aria-label',
				args.readOnly ? 'Ice cream flavor, required, read-only' : 'Ice cream flavor, required'
			)
		} else if (!args.required) {
			expect(select).not.toHaveAttribute('aria-label', 'Ice cream flavor, required.')
		}
		if (args.disabled) {
			expect(select).toBeDisabled()
		} else if (args.readOnly) {
			expect(select).toHaveAttribute('data-readonly', 'true')
		} else {
			//open dropdown
			await userEvent.click(select)
			expect(select).toHaveAttribute('aria-expanded', 'true')

			//look for it on screen and not canvas because radix creates a separate div outside of the element (the native select is hidden from the canvas)
			const optionChocolate = screen.getByRole('option', { name: 'Chocolate' })
			//cannot look for its value because the value is actually on the hidden select element
			expect(optionChocolate).toHaveAccessibleName()
			await userEvent.click(optionChocolate) //bug in new storybook/test ?
			await userEvent.click(optionChocolate) //double click on select option in testing suite
			await waitFor(() => {
				expect(select).toHaveAttribute('aria-expanded', 'false')
				expect(canvas.getAllByText('Chocolate')[0]).toBeVisible() //the selected value in the selectfield
			})

			if (args.canClearSelection) {
				//open dropdown
				await userEvent.click(select)
				expect(select).toHaveAttribute('aria-expanded', 'true')
				//unselect option
				const unselect = await screen.getByRole('option', {
					name: 'Select flavor',
				})
				expect(unselect).toHaveAccessibleName()
				await userEvent.click(unselect)
				//resets to placeholder
				await waitFor(() => {
					expect(within(select).getByText('Select flavor')).toBeVisible()
				})
			}
			//open dropdown
			await userEvent.click(select)
			expect(select).toHaveAttribute('aria-expanded', 'true')
			//select option Mint
			const optionMint = await screen.findByRole('option', { name: 'Mint' })
			expect(optionMint).toHaveAccessibleName()
			await userEvent.click(optionMint)
			expect(select).toHaveAttribute('aria-expanded', 'false')
			expect(within(select).getByText('Mint')).toBeVisible()

			//submit
			const submit = canvas.getByRole('button', { name: 'Submit' })
			await userEvent.click(submit)
			expect(
				screen.getByRole('alertdialog', {
					name: 'You submitted the following values:',
				})
			).toBeVisible()
			const dismissToast = screen.getAllByRole('button', { name: 'Dismiss' })[0]
			await userEvent.click(dismissToast)
		}
	},
}

export default meta

type Story = StoryObj<typeof SelectFieldDemo>

export const Default: Story = {}
