import React from 'react'
import type { StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { ComboboxField, ComboboxFieldItem, ComboboxFieldSection } from './ComboboxField'
import { screen, within, expect, userEvent, waitFor } from '@storybook/test'

import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import { Button } from '@/components/buttons/Button'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'

import states from '../SelectFieldOptions/states.json'
import countries from '../SelectFieldOptions/countries.json'

const FormSchema = z.object({
	combobox: z
		.string({
			required_error: 'Select an option.',
		})
		//important value must not be ""
		.refine((data) => data.trim() !== '', {
			message: 'Select a flavor.',
		}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const ComboboxFieldDemo = ({
	label,
	srOnlyLabel,
	placeholder,
	description,
	srOnlyDescription,
	disabled,
	readOnly,
	maxHeight,
	required,
	variant,
}: {
	label: string
	srOnlyLabel?: boolean
	placeholder: string
	description: string
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	maxHeight: number | undefined
	required?: boolean
	variant?: 'default' | 'search'
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<Form formMethods={form} formName="Combobox form" onSubmit={onSubmit} className="w-60">
				<ComboboxField
					control={form.control}
					name="combobox"
					id="combobox"
					label={label}
					srOnlyLabel={srOnlyLabel}
					description={description}
					placeholder={placeholder}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					maxHeight={maxHeight}
					required={required}
					variant={variant}
				>
					<ComboboxFieldItem variant={variant} value="Vanilla">
						Vanilla
					</ComboboxFieldItem>
					<ComboboxFieldItem variant={variant} value="Chocolate">
						Chocolate
					</ComboboxFieldItem>
					<ComboboxFieldItem variant={variant} value="Mint">
						Mint
					</ComboboxFieldItem>
					<ComboboxFieldItem variant={variant} value="Strawberry">
						Strawberry
					</ComboboxFieldItem>

					<ComboboxFieldSection title="Sorbet">
						<ComboboxFieldItem variant={variant} value="Lemon Sorbet">
							Lemon Sorbet
						</ComboboxFieldItem>
					</ComboboxFieldSection>
				</ComboboxField>
				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

const meta = {
	title: 'Forms/Fields/ComboboxField',
	render: ({ ...args }) => (
		<ComboboxFieldDemo
			label={args.label}
			srOnlyLabel={args.srOnlyLabel}
			placeholder={args.placeholder}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
			maxHeight={args.maxHeight}
			required={args.required}
			variant={args.variant}
		/>
	),
	argTypes: {
		variant: { options: ['default', 'search'], control: 'radio' },
	},
	args: {
		variant: 'default',
		label: 'Ice cream flavor',
		placeholder: 'Pick flavor',
		description: 'Select your ice cream flavor',
		srOnlyLabel: false,
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		maxHeight: undefined,
		required: true,
	},
	//@ts-expect-error implicit any in args
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		if (!canvas.queryByRole('form', { name: 'Combobox form' })) return

		const combobox = canvas.getByRole('combobox', {
			name: new RegExp(args.label, 'i'),
		})
		expect(combobox).toBeInTheDocument()
		expect(combobox).toBeVisible()
		expect(combobox).toHaveAccessibleName()
		args.disabled ? expect(combobox).toBeDisabled() : expect(combobox).toBeEnabled()
		args.readOnly
			? expect(combobox).toHaveAttribute('readonly')
			: expect(combobox).not.toHaveAttribute('readonly')
		args.required ? expect(combobox).toBeRequired() : expect(combobox).not.toBeRequired()

		if (args.disabled || args.readOnly) return

		await userEvent.click(combobox)
		expect(combobox).toHaveFocus()
		await userEvent.keyboard('[ArrowDown]')
		let listbox = screen.getByRole('listbox')
		await waitFor(() => {
			listbox = screen.getByRole('listbox')
			expect(listbox).toBeVisible()
		})
		const vanilla = within(listbox!).getByRole('option', { name: 'Vanilla' })
		await userEvent.click(vanilla)
		expect(combobox).toHaveAttribute('value', 'Vanilla')
		combobox.blur()
	},
}

export default meta

export const Default: StoryObj = {}

//States story
const ComboboxFieldStatesDemo = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<Form formMethods={form} formName="States form" onSubmit={onSubmit} className="w-60">
				<ComboboxField
					variant="default"
					control={form.control}
					name="combobox"
					id="combobox"
					label="Select state"
					description="Select state"
					placeholder="Select state"
				>
					{states.map((state, i) => {
						return (
							<ComboboxFieldItem key={state.abbreviation + i} value={state.abbreviation}>
								{state.name}
							</ComboboxFieldItem>
						)
					})}
				</ComboboxField>
				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

export const StatesExample = {
	title: 'Forms/Fields/ComboboxField',
	render: () => <ComboboxFieldStatesDemo />,
}

//States story
const ComboboxFieldCountriesDemo = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<Form formMethods={form} formName="Country form" onSubmit={onSubmit} className="w-60">
				<ComboboxField
					variant="default"
					control={form.control}
					name="combobox"
					id="combobox"
					label="Select country"
					description="Select country"
					placeholder="Select country"
				>
					{countries.map((country, i) => {
						return (
							<ComboboxFieldItem key={country.name + i} value={country.name}>
								{country.name}
							</ComboboxFieldItem>
						)
					})}
				</ComboboxField>
				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

export const CountriesExample = {
	title: 'Forms/Fields/ComboboxField',
	render: () => <ComboboxFieldCountriesDemo />,
}
