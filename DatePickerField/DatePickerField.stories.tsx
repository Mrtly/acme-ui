import { useCallback, useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { Button } from '@/components/buttons/Button'
import { DatePickerField } from './DatePickerField'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { within, expect } from '@storybook/test'

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

const FormSchema = z.object({
	date_picker: z.date({
		required_error: 'Pick a date.',
	}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
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

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	// the below handles validation within the DatePickerField for unavailable dates
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

	const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
		if (datepickerError) {
			//set the error message again because RHF removes it
			setErrorMessage(datepickerError)
			// focus on the first invalid field
			const firstErrorField = Object.keys(form.formState.errors)[0]
			// @ts-expect-error possibly empty obj
			const fieldRef = form.control._fields?.[firstErrorField]?._f.ref
			fieldRef && fieldRef.focus()
		} else {
			onSubmit(data) //proceed to submission
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

const meta: Meta = {
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
		minDate: new Date(1900, 0, 1),
		maxDate: undefined,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const datepicker = canvas.getByTestId('datepicker')
		expect(datepicker).toBeInTheDocument()
		expect(datepicker).toBeVisible()
		expect(datepicker).toHaveAccessibleName()
		args.description && expect(datepicker).toHaveAccessibleDescription()

		//a chromium playwright bug causes an error in the datepicker field on the CI
		//https://github.com/adobe/react-spectrum/issues/7457
		//https://github.com/microsoft/playwright/issues/34046
		//cannot write further interaction tests until this^ is fixed
	},
}

export default meta

export const Default: StoryObj = {}
