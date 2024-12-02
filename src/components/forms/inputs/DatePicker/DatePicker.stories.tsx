import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from './DatePicker'
import { DateFormat } from '../../../../other/DateFormat'
import { within, expect, userEvent, screen, waitFor } from '@storybook/test'
import { cn } from '@/utils/cn'

type DemoProps = {
	label: string
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	srOnlyLabel?: boolean
	showOptional?: boolean
	showCalendarValue?: boolean
	disablePastDates?: boolean
	disableWeekends?: boolean
	disableToday?: boolean
	minDate?: Date
	maxDate?: Date
}

const DatePickerDemo = ({
	label,
	required,
	disabled,
	readOnly,
	srOnlyLabel,
	showOptional,
	showCalendarValue,
	disablePastDates,
	disableWeekends,
	disableToday,
	minDate,
	maxDate,
}: DemoProps) => {
	const [date, setDate] = React.useState<Date | undefined>()
	const [invalid, setInvalid] = React.useState<boolean>(false)

	return (
		<div className="flex flex-col gap-4 max-w-sm">
			<DatePicker
				id="datepicker"
				label={label}
				required={required}
				disabled={disabled}
				readOnly={readOnly}
				srOnlyLabel={srOnlyLabel}
				showOptional={showOptional}
				onDateChange={setDate}
				onValidation={setInvalid}
				//calendar
				showCalendarValue={showCalendarValue}
				disablePastDates={disablePastDates}
				disableWeekends={disableWeekends}
				disableToday={disableToday}
				// The date control will convert the date into a UNIX timestamp when the value changes. https://storybook.js.org/docs/api/arg-types
				minDate={minDate && new Date(minDate)}
				maxDate={maxDate && new Date(maxDate)}
			/>
			{date && (
				<div role="alert" className="text-sm">
					<div>selected date:</div>
					<DateFormat date={date} className="font-semibold" />
					<div className={cn(invalid ? 'text-error' : 'text-success')}>
						{invalid ? 'invalid date' : 'valid date'}
					</div>
				</div>
			)}
		</div>
	)
}

const meta: Meta<typeof DatePicker> = {
	title: 'Forms/Inputs/DatePicker',
	render: ({ ...args }) => (
		<DatePickerDemo
			label={args.label}
			required={args.required}
			disabled={args.disabled}
			readOnly={args.readOnly}
			srOnlyLabel={args.srOnlyLabel}
			showOptional={args.showOptional}
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
		label: 'Datepicker',
		required: false,
		disabled: false,
		readOnly: false,
		srOnlyLabel: false,
		showOptional: false,
		//calendar args
		showCalendarValue: true,
		disablePastDates: false,
		disableWeekends: false,
		disableToday: false,
		minDate: undefined,
		maxDate: undefined,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const datepicker = canvas.getByTestId('datepicker')
		expect(datepicker).toBeInTheDocument()
		expect(datepicker).toBeVisible()
		expect(datepicker).toHaveAccessibleName()

		// TODO: update tests with props, to consider disabled dates

		if (args.required) {
			const dateInputs = canvas.getAllByRole('spinbutton')
			expect(dateInputs[0]).toHaveAttribute('aria-required', 'true')
		}

		if (args.disabled) {
			expect(datepicker).toHaveAttribute('aria-disabled', 'true')
		}

		let dateInputs = canvas.getAllByRole('spinbutton')
		await userEvent.click(dateInputs[0])
		await userEvent.type(dateInputs[0], '12')
		await userEvent.type(dateInputs[1], '06')
		await userEvent.type(dateInputs[2], '2025')

		const calendarBtn = canvas.getByRole('button', {
			name: /Calendar Datepicker/i,
		})
		await userEvent.click(calendarBtn)

		//calendar is open
		const calendar = screen.getByRole('application', {
			name: `${args.label}, December 2025`,
		})
		expect(calendar).toBeInTheDocument()
		expect(within(calendar).getByRole('gridcell', { name: '6' })).toHaveAttribute(
			'aria-selected',
			'true'
		)
		//5 is selected
		if (args.showCalendarValue) {
			expect(within(calendar).getByText('December 6, 2025')).toBeInTheDocument()
		}

		await userEvent.keyboard('{Escape}')
		//calendar is closed
		await waitFor(() =>
			expect(
				screen.queryByRole('application', {
					name: `${args.label}, December 2025`,
				})
			).not.toBeInTheDocument()
		)

		//date print (not part of the component)
		expect(canvas.getByText('December 6, 2025')).toBeInTheDocument()

		if (args.disableWeekends) {
			//December 6, 2025 is Saturday
			dateInputs = canvas.getAllByRole('spinbutton')
			expect(dateInputs[0]).toHaveAttribute('data-invalid', 'true')
			expect(dateInputs[1]).toHaveAttribute('data-invalid', 'true')
			expect(dateInputs[2]).toHaveAttribute('data-invalid', 'true')
		}
	},
}

export default meta

type Story = StoryObj<typeof DatePicker>

export const Default: Story = {}
