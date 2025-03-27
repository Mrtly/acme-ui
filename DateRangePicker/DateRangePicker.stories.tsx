import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DateRangePicker } from './DateRangePicker'
import { DateFormat } from '@/components/utility/DateFormat'
import { RangeValue } from '../elements/RangeCalendar'
import { cn } from '@/utils/cn'
import { within, expect, userEvent, screen } from '@storybook/test'

const today = new Date()
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const formatDateRange = (startDate: Date, endDate: Date) => {
	return `${startDate.toLocaleDateString('en-US')}-${endDate.toLocaleDateString('en-US')}`
}

const Demo = ({ ...args }) => {
	const [range, setRange] = useState<RangeValue<Date> | undefined>({
		start: today,
		end: tomorrow,
	})
	const [invalid, setInvalid] = useState<boolean>(false)

	return (
		<div className="flex flex-col gap-4 max-w-sm">
			<DateRangePicker
				{...args}
				id="daterangepicker"
				label={args.label}
				value={range}
				onChange={setRange}
				required={args.required}
				disabled={args.disabled}
				readOnly={args.readOnly}
				srOnlyLabel={args.srOnlyLabel}
				showOptional={args.showOptional}
				onValidation={setInvalid}
				//calendar
				showCalendarValue={args.showCalendarValue}
				disablePastDates={args.disablePastDates}
				disableWeekends={args.disableWeekends}
				disableToday={args.disableToday}
				// The date control will convert the date into a UNIX timestamp when the value changes. https://storybook.js.org/docs/api/arg-types
				minDate={args.minDate && new Date(args.minDate)}
				maxDate={args.maxDate && new Date(args.maxDate)}
			/>
			{range && (
				<div role="alert" className="text-sm">
					<div>selected date:</div>
					<DateFormat date={range.start!} className="font-semibold" />
					<span className="mx-1">-</span>
					<DateFormat date={range.end!} className="font-semibold" />
					<div className={cn(invalid ? 'text-error-500' : 'text-success-500')}>
						{invalid ? 'invalid dates' : 'valid dates'}
					</div>
				</div>
			)}
		</div>
	)
}

const meta: Meta = {
	title: 'Inputs/DateRangePicker',
	render: ({ ...args }) => <Demo {...args} />,
	args: {
		label: 'Date range picker',
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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const daterangepicker = canvas.getByTestId('daterangepicker')
		expect(daterangepicker).toBeInTheDocument()
		expect(daterangepicker).toBeVisible()
		expect(daterangepicker).toHaveAccessibleName()

		const rangeString = formatDateRange(today, tomorrow) //ie. 3/27/2025-3/28/2025
		await expect(daterangepicker).toHaveTextContent(rangeString)

		const dateInputs = canvas.getAllByRole('spinbutton')
		await userEvent.click(dateInputs[0])
		await userEvent.type(dateInputs[0], today.getMonth().toString())
		await userEvent.type(dateInputs[1], '1')
		await userEvent.type(dateInputs[2], '2025')

		const calendarBtn = canvas.getByRole('button', {
			name: /Calendar/i,
		})
		await userEvent.click(calendarBtn) //open

		await expect(
			screen.getByRole('dialog', { name: 'Calendar Date Range Picker' })
		).toBeInTheDocument()

		await userEvent.click(calendarBtn) //close

		await expect(
			screen.queryByRole('dialog', { name: 'Calendar Date Range Picker' })
		).not.toBeInTheDocument()
	},
}

export default meta

export const Default: StoryObj = {}
