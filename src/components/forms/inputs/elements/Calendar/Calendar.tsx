'use client'
import React from 'react'
import { DateFormat } from '../../../../../backlog/DateFormat'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'
import {
	Heading,
	Button,
	Calendar as CalendarComponent,
	CalendarCell,
	CalendarGrid,
	CalendarGridHeader,
	CalendarHeaderCell,
	CalendarGridBody,
	CalendarStateContext,
	useLocale,
} from 'react-aria-components'
import { DateValue, getLocalTimeZone, isSameDay, parseDate } from '@internationalized/date'
import { today, isWeekend } from '@internationalized/date'

// uses Calendar from Adobe's react-aria-components library
// (https://react-spectrum.adobe.com/react-aria/Calendar.html)
// uses Adobe's @internationalized/date package (objects and functions for representing dates)
// (https://react-spectrum.adobe.com/internationalized/date/index.html)

// ------------------------------------- Calendar

export type CalendarProps = {
	ariaLabel?: string
	disablePastDates?: boolean
	disableWeekends?: boolean
	disableToday?: boolean
	minDate?: Date
	maxDate?: Date
	showCalendarValue?: boolean
	defaultDate?: Date
	readOnly?: boolean
}

const Calendar = ({
	ariaLabel,
	disablePastDates,
	disableWeekends,
	disableToday,
	minDate,
	maxDate,
	showCalendarValue,
	readOnly,
	defaultDate,
}: CalendarProps) => {
	function CalendarValue() {
		const state = React.useContext(CalendarStateContext)
		const date = state?.value?.toDate(getLocalTimeZone())
		const formatted = date ? <DateFormat date={date} /> : 'None'
		return <div className="text-sm text-gray-500 pl-3 my-1">Selected date: {formatted}</div>
	}

	const { locale } = useLocale()
	const isDateUnavailable = (date: DateValue) => {
		return (
			(disableWeekends && isWeekend(date, locale)) ||
			(disableToday && isSameDay(date, today(getLocalTimeZone()))) || // TODO: isToday throws on timezone/locale ?
			false
		)
	}

	function convertToDateValue(date: Date | undefined) {
		return date ? parseDate(date?.toISOString().split('T')[0]) : undefined
	}

	const minValue = disablePastDates ? today(getLocalTimeZone()) : undefined

	// parses dates to DateValue type (used by @internationalized/date)
	const minDateToMinValue = convertToDateValue(minDate)
	const maxDateToMaxValue = convertToDateValue(maxDate)
	const defaultValue = convertToDateValue(defaultDate)

	return (
		<CalendarComponent
			aria-label={ariaLabel || 'Select a date'}
			className="w-fit border rounded-md p-2 bg-white"
			minValue={minValue || minDateToMinValue}
			maxValue={maxDateToMaxValue}
			isDateUnavailable={isDateUnavailable}
			isReadOnly={readOnly}
			defaultValue={defaultValue}
		>
			<div className="flex justify-around items-center w-full my-3 text-gray-800">
				<Button slot="previous" aria-label="previous month">
					<Icon name="ChevronLeft" size="sm" />
				</Button>
				<Heading className="text-sm tracking-wide" />
				<Button slot="next" aria-label="next month">
					<Icon name="ChevronRight" size="sm" />
				</Button>
			</div>

			<CalendarGrid className="m-1" data-testid="calendar-table">
				<CalendarGridHeader className="">
					{(day) => (
						<CalendarHeaderCell className="font-normal text-sm text-gray-500">
							{day}
						</CalendarHeaderCell>
					)}
				</CalendarGridHeader>
				<CalendarGridBody>
					{(date) => (
						<CalendarCell
							date={date}
							className={cn(
								'py-1 px-2 rounded text-center text-sm text-gray-700 border border-transparent hover:border-gray-800',
								'data-[disabled]:opacity-40 data-[disabled]:hover:border-none data-[disabled]:cursor-default',
								'data-[unavailable]:opacity-40 data-[unavailable]:hover:border-none data-[unavailable]:cursor-default',
								'focus:outline-black data-[selected]:bg-brand data-[selected]:text-white',
								readOnly && 'opacity-75 cursor-default'
							)}
						/>
					)}
				</CalendarGridBody>
			</CalendarGrid>
			{showCalendarValue && <CalendarValue />}
		</CalendarComponent>
	)
}
// ------------------------------------- Calendar export

export { Calendar }
