import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, CalendarProps } from './Calendar'
import { expect, within } from '@storybook/test'

const CalendarDemo = ({
	disablePastDates,
	disableWeekends,
	disableToday,
	minDate,
	maxDate,
	showCalendarValue,
	readOnly,
}: CalendarProps) => {
	const today = new Date()

	return (
		<>
			<Calendar
				disablePastDates={disablePastDates}
				disableWeekends={disableWeekends}
				disableToday={disableToday}
				minDate={minDate}
				maxDate={maxDate}
				showCalendarValue={showCalendarValue}
				readOnly={readOnly}
				defaultDate={today}
			/>
		</>
	)
}

const meta: Meta<typeof Calendar> = {
	title: 'Forms/Inputs/Elements/Calendar',
	render: ({ ...args }) => (
		<CalendarDemo
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
		const today = new Date()
		const month = today.toLocaleString('default', { month: 'long' })
		const year = today.getFullYear()

		// these tests do not consider any disabled or unavailable dates & may fail occassionaly

		const canvas = within(canvasElement)
		//calendar
		const calendar = canvas.getByRole('application', {
			name: `Select a date, ${month} ${year}`,
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
		//selected date (text)
		if (args.showCalendarValue) {
			await expect(within(calendar).getByText(/Selected date/i)).toBeInTheDocument()
		}
	},
}

export default meta

type Story = StoryObj<typeof Calendar>

export const Default: Story = {}
