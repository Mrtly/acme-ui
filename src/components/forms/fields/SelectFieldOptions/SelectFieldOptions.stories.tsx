import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import { SelectFieldOptions } from './SelectFieldOptions'
import { Button } from '@/components/buttons/Button'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { screen, userEvent, within, waitFor, expect } from '@storybook/test'

const StateSchema = z.object({
	state: z.string({
		required_error: 'Select state.',
	}),
})

const onSubmit = (data: z.infer<typeof StateSchema | typeof CountrySchema | typeof TimeSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const SelectFieldOptionsDemo = ({
	srOnlyLabel,
	placeholder,
	description,
	srOnlyDescription,
	disabled,
	readOnly,
	stateValueDisplayed,
	required,
}: {
	srOnlyLabel?: boolean
	placeholder: string
	description: string
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	stateValueDisplayed?: 'name' | 'abbreviation'
	required?: boolean
}) => {
	const stateForm = useForm<z.infer<typeof StateSchema>>({
		resolver: zodResolver(StateSchema),
	})

	return (
		<>
			<Form
				formMethods={stateForm}
				formName="select US state form"
				onSubmit={onSubmit}
				className="w-60"
			>
				<SelectFieldOptions
					options="state"
					control={stateForm.control}
					name="state"
					id="state"
					label="State"
					srOnlyLabel={srOnlyLabel}
					description={description}
					placeholder={placeholder}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					stateValueDisplayed={stateValueDisplayed}
					required={required}
				/>

				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

const meta: Meta<typeof SelectFieldOptionsDemo> = {
	title: 'Forms/Fields/SelectFieldOptions',
	render: ({ ...args }) => (
		<SelectFieldOptionsDemo
			srOnlyLabel={args.srOnlyLabel}
			placeholder={args.placeholder}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
			stateValueDisplayed={args.stateValueDisplayed}
			required={args.required}
		/>
	),
	args: {
		srOnlyLabel: false,
		placeholder: '',
		description: 'Select your state',
		srOnlyDescription: true,
		disabled: false,
		readOnly: false,
		stateValueDisplayed: 'abbreviation',
		required: true,
	},
	argTypes: {
		stateValueDisplayed: {
			control: 'radio',
			options: ['name', 'abbreviation'],
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		if (!canvas.queryByLabelText('State')) {
			return //interactions for the State story only
		}

		const select = canvas.getByLabelText('State')
		await expect(select).toBeVisible()
		await expect(select).toHaveAttribute('aria-expanded', 'false')
		await expect(select).toHaveAccessibleName()
		if (args.description) {
			await expect(select).toHaveAccessibleDescription()
		}
		await expect(select).toHaveTextContent(/Select/i) //placeholder
		if (args.disabled) {
			await expect(select).toBeDisabled()
		} else if (args.readOnly) {
			await expect(select).toHaveAttribute('data-readonly', 'true')
		} else {
			//open dropdown
			await userEvent.click(select)
			await expect(select).toHaveAttribute('aria-expanded', 'true')
			//select Colorado
			//look for it on screen and not canvas because radix creates a separate div outside of the element (the native select is hidden from the canvas)
			const optionColorado = screen.getByRole('option', { name: 'Colorado' })
			//cannot look for its value because the value is actually on the hidden select element
			await expect(optionColorado).toHaveAccessibleName()
			await userEvent.click(optionColorado)
			await userEvent.click(optionColorado) //double click on select option in testing suite
			await waitFor(async () => {
				await expect(select).toHaveAttribute('aria-expanded', 'false')
				await expect(select).toHaveTextContent('CO')
				if (args.stateValueDisplayed === 'abbreviation') {
					await expect(canvas.getAllByText('CO')[0]).toBeVisible() //the selected value displayed
				} else if (args.stateValueDisplayed === 'name') {
					await expect(canvas.getAllByText('Colorado')[0]).toBeVisible()
				}
			})
			//reopen dropdown
			await userEvent.click(select)
			await expect(select).toHaveAttribute('aria-expanded', 'true')
			//select Arizona
			const optionArizona = await screen.findByRole('option', {
				name: 'Arizona',
			})
			await expect(optionArizona).toHaveAccessibleName()
			await userEvent.click(optionArizona)
			await userEvent.click(optionArizona) //double click on select option in testing suite
			await expect(select).toHaveAttribute('aria-expanded', 'false')
			await expect(select).toHaveTextContent('AZ')
			if (args.stateValueDisplayed === 'abbreviation') {
				await expect(canvas.getAllByText('AZ')[0]).toBeVisible() //the selected value displayed
			} else if (args.stateValueDisplayed === 'name') {
				await expect(canvas.getAllByText('Arizona')[0]).toBeVisible()
			}
		}
	},
}

export default meta

type Story = StoryObj<typeof SelectFieldOptionsDemo>

export const State: Story = {}

// ------------------------------------- Country

const CountrySchema = z.object({
	country: z.string({
		required_error: 'Select country.',
	}),
})

const CountryDemo = () => {
	const countryForm = useForm<z.infer<typeof CountrySchema>>({
		resolver: zodResolver(CountrySchema),
	})

	return (
		<>
			<Form
				formMethods={countryForm}
				formName="select country form"
				onSubmit={onSubmit}
				className="w-44"
			>
				<SelectFieldOptions
					options="country"
					control={countryForm.control}
					name="country"
					id="country"
					label="Country"
					required
					className="w-60"
				/>

				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

export const Country: Story = {
	render: () => <CountryDemo />,
}

// ------------------------------------- Time

const TimeSchema = z.object({
	time: z.string({
		required_error: 'Select a time.',
	}),
})

const TimeDemo = () => {
	const timeForm = useForm<z.infer<typeof TimeSchema>>({
		resolver: zodResolver(TimeSchema),
	})

	return (
		<>
			<Form formMethods={timeForm} formName="select time form" onSubmit={onSubmit} className="w-32">
				<SelectFieldOptions
					options="time"
					control={timeForm.control}
					name="time"
					id="time"
					label="Time"
					required
				/>

				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

export const Time: Story = {
	render: () => <TimeDemo />,
}
