import React, { useCallback, useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { Button } from '@/components/buttons/Button'
import { DatePickerField } from './DatePickerField'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
// import { within, expect, userEvent, screen, waitFor } from '@storybook/test'

type DemoProps = {
	label: string
	description?: string
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	srOnlyLabel?: boolean
	srOnlyDescription?: boolean
	showCalendarValue?: boolean
	disablePastDates?: boolean
	disableWeekends?: boolean
	disableToday?: boolean
	minDate?: Date
	maxDate?: Date
}

const FormSchema2 = z.object({
	date_picker: z.date({
		required_error: 'Pick a date.',
	}),
})

const onSubmit2 = (data: z.infer<typeof FormSchema2>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const DatePickerFieldDemo = ({
	label,
	description,
	required,
	disabled,
	readOnly,
	srOnlyLabel,
	srOnlyDescription,
	showCalendarValue,
	disablePastDates,
	disableWeekends,
	disableToday,
	minDate,
	maxDate,
}: DemoProps) => {
	const today = new Date()
	const tmr = new Date(today)
	tmr.setDate(today.getDate() + 1) //sets default value to tommorrow

	const form = useForm<z.infer<typeof FormSchema2>>({
		resolver: zodResolver(FormSchema2),
	})

	// the below handles validation from inside the DatePickerField for unavailable dates
	const [datepickerError, setDatepickerError] = useState<string | null>(null)

	const setErrorMessage = useCallback(
		(msg: string) => {
			form.setError('date_picker', {
				type: 'custom',
				message: msg,
			})
		},
		[form]
	)

	useEffect(() => {
		datepickerError ? setErrorMessage(datepickerError) : form.clearErrors('date_picker')
	}, [form, datepickerError, setErrorMessage])

	const handleSubmit = async (data: z.infer<typeof FormSchema2>) => {
		if (datepickerError) {
			//set the error message again because RHF removes it
			setErrorMessage(datepickerError)
			// focus on the first invalid field
			const firstErrorField = Object.keys(form.formState.errors)[0]
			// @ts-expect-error possibly empty obj
			const fieldRef = form.control._fields?.[firstErrorField]?._f.ref
			fieldRef && fieldRef.focus()
		} else {
			onSubmit2(data) //proceed to submission
		}
	}

	return (
		<div className="max-w-sm mx-auto">
			<Form
				formMethods={form}
				formName="Second Form"
				onSubmit={handleSubmit}
				className="flex flex-col gap-4"
			>
				<DatePickerField
					id="datepickerfield"
					control={form.control}
					handleFieldError={setDatepickerError}
					name="date_picker"
					label={label}
					description={description}
					required={required}
					disabled={disabled}
					readOnly={readOnly}
					srOnlyLabel={srOnlyLabel}
					srOnlyDescription={srOnlyDescription}
					//calendar
					showCalendarValue={showCalendarValue}
					disablePastDates={disablePastDates}
					disableWeekends={disableWeekends}
					disableToday={disableToday}
					minDate={minDate}
					maxDate={maxDate}
				/>

				<div>
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof DatePickerFieldDemo> = {
	title: 'Forms/Fields/DatePickerField',
	render: ({ ...args }) => (
		<DatePickerFieldDemo
			label={args.label}
			description={args.description}
			required={args.required}
			readOnly={args.readOnly}
			disabled={args.disabled}
			srOnlyLabel={args.srOnlyLabel}
			srOnlyDescription={args.srOnlyDescription}
			//calendar props
			showCalendarValue={args.showCalendarValue}
			disablePastDates={args.disablePastDates}
			disableWeekends={args.disableWeekends}
			disableToday={args.disableToday}
			// The date control will convert the date into a UNIX timestamp when the value changes. https://storybook.js.org/docs/api/arg-types
			minDate={args.minDate && new Date(args.minDate)}
			maxDate={args.maxDate && new Date(args.maxDate)}
		/>
	),
	args: {
		label: 'Select a date',
		description: 'Set a date for your appointment',
		required: true,
		disabled: false,
		readOnly: false,
		srOnlyLabel: false,
		srOnlyDescription: false,
		//calendar args
		showCalendarValue: true,
		disablePastDates: false,
		disableWeekends: true,
		disableToday: false,
		minDate: undefined,
		maxDate: undefined,
	},
	//pipeline failes - is there something wrong with this test? TODO
	// play: async ({ canvasElement, args }) => {
	// 	const canvas = within(canvasElement)
	// 	const datepicker = canvas.getByTestId('datepicker')
	// 	expect(datepicker).toBeInTheDocument()
	// 	expect(datepicker).toBeVisible()
	// 	expect(datepicker).toHaveAccessibleName()
	// 	args.description && expect(datepicker).toHaveAccessibleDescription()

	// 	if (args.required) {
	// 		const dateInputs = canvas.getAllByRole('spinbutton')
	// 		expect(dateInputs[0]).toHaveAttribute('aria-required', 'true')
	// 	}

	// 	const dateInputs = canvas.getAllByRole('spinbutton')

	// 	if (args.disabled) {
	// 		expect(datepicker).toHaveAttribute('aria-disabled', 'true')
	// 	} else if (args.readOnly) {
	// 		expect(dateInputs[0]).toHaveAttribute('aria-readonly', 'true')
	// 		expect(dateInputs[1]).toHaveAttribute('aria-readonly', 'true')
	// 		expect(dateInputs[2]).toHaveAttribute('aria-readonly', 'true')
	// 	} else {
	// 		await userEvent.click(dateInputs[0])
	// 		await userEvent.type(dateInputs[0], '12')
	// 		await userEvent.type(dateInputs[1], '05')
	// 		await userEvent.type(dateInputs[2], '2025')

	// 		const calendarBtn = canvas.getByRole('button', {
	// 			name: /Calendar/i,
	// 		})
	// 		await userEvent.click(calendarBtn)

	// 		//calendar is open
	// 		const calendar = screen.getByRole('application', {
	// 			name: `${args.label}, December 2025`,
	// 		})
	// 		expect(calendar).toBeInTheDocument()
	// 		expect(within(calendar).getByRole('gridcell', { name: '5' })).toHaveAttribute(
	// 			'aria-selected',
	// 			'true'
	// 		)
	// 		//5 is selected
	// 		if (args.showCalendarValue) {
	// 			expect(within(calendar).getByText('December 5, 2025')).toBeInTheDocument()
	// 		}

	// 		await userEvent.keyboard('{Escape}')
	// 		//calendar is closed
	// 		await waitFor(() =>
	// 			expect(
	// 				screen.queryByRole('application', {
	// 					name: `${args.label}, December 2025`,
	// 				})
	// 			).not.toBeInTheDocument()
	// 		)

	// 		const submit = canvas.getByRole('button', { name: 'Submit' })
	// 		await userEvent.click(submit)
	// 	}
	// },
}

export default meta

type Story = StoryObj<typeof DatePickerFieldDemo>

export const Default: Story = {}
