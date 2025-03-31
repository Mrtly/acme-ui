import type { Meta, StoryObj } from '@storybook/react'
import { RangeCalendar, RangeCalendarProps } from './RangeCalendar'
import { expect, within } from '@storybook/test'

const RangeCalendarDemo = ({
	disablePastDates,
	disableWeekends,
	disableToday,
	minDate,
	maxDate,
	showCalendarValue,
	readOnly,
}: RangeCalendarProps) => {
	const today = new Date()
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)

	return (
		<RangeCalendar
			disablePastDates={disablePastDates}
			disableWeekends={disableWeekends}
			disableToday={disableToday}
			minDate={minDate}
			maxDate={maxDate}
			showCalendarValue={showCalendarValue}
			readOnly={readOnly}
			defaultValue={{ start: today, end: tomorrow }}
			onChange={(v) => console.log(v)}
		/>
	)
}

const meta: Meta = {
	title: 'Inputs/Elements/RangeCalendar',
	render: ({ ...args }) => (
		<RangeCalendarDemo
			disablePastDates={args.disablePastDates}
			disableWeekends={args.disableWeekends}
			disableToday={args.disableToday}
			// The date control will convert the date into a UNIX timestamp when the value changes. https://storybook.js.org/docs/api/arg-types
			minDate={args.minDate && new Date(args.minDate)}
			maxDate={args.maxDate && new Date(args.maxDate)}
			showCalendarValue={args.showCalendarValue}
			readOnly={args.readOnly}
		/>
	),
	args: {
		disablePastDates: false,
		disableWeekends: false,
		disableToday: false,
		minDate: undefined,
		maxDate: undefined,
		readOnly: false,
		showCalendarValue: true,
	},
	argTypes: {
		minDate: { control: 'date' },
		maxDate: { control: 'date' },
	},
	play: async ({ canvasElement, args }) => {
		//the tests do not consider unavailable dates (may fail occassionaly)
		const today = new Date()
		const month = today.toLocaleString('default', { month: 'long' })
		const year = today.getFullYear()

		const canvas = within(canvasElement)
		//calendar
		const calendar = canvas.getByRole('application', {
			name: `Select a date range, ${month} ${year}`,
		})
		await expect(calendar).toBeInTheDocument()
		await expect(calendar).toHaveAccessibleName()

		if (args.readOnly) {
			await expect(within(calendar).getByTestId('calendar-table')).toHaveAttribute(
				'aria-readonly',
				'true'
			)
			return
		}
		//buttons & heading
		const prevBtn = within(calendar).getByRole('button', {
			name: 'previous month',
		})
		await expect(prevBtn).toBeVisible()
		await expect(prevBtn).toHaveAccessibleName()
		const nextBtn = within(calendar).getByRole('button', { name: 'next month' })
		await expect(nextBtn).toBeVisible()
		await expect(nextBtn).toHaveAccessibleName()
		const calendarHeading = within(calendar).getByText(`${month} ${year}`)
		await expect(calendarHeading).toBeVisible()
		//selected date range displayed text
		if (args.showCalendarValue) {
			await expect(within(calendar).getByText(/Selected date range/i)).toBeInTheDocument()
		}
	},
}

export default meta

type Story = StoryObj

export const Default: Story = {}
