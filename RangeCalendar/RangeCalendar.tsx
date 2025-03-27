'use client'
import { use } from 'react'

import {
	Heading,
	Button,
	RangeCalendar as RACRangeCalendar,
	RangeCalendarStateContext,
	CalendarCell,
	CalendarGrid,
	CalendarGridHeader,
	CalendarHeaderCell,
	CalendarGridBody,
} from 'react-aria-components'
import {
	CalendarDate,
	DateValue,
	getLocalTimeZone,
	isSameDay,
	parseDate,
	today,
	isWeekend,
} from '@internationalized/date'
import { useDateFormatter } from 'react-aria'

import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// uses RangeCalendar from Adobe's react-aria-components library
// (https://react-spectrum.adobe.com/react-aria/RangeCalendar.html)
// uses Adobe's @internationalized/date package (objects and functions for representing dates)
// (https://react-spectrum.adobe.com/internationalized/date/index.html)

// ------------------------------------- RangeCalendar

export interface RangeValue<T> {
	start: T | null
	end: T | null
}

export type RangeCalendarProps = {
	ariaLabel?: string
	disablePastDates?: boolean
	disableWeekends?: boolean
	disableToday?: boolean
	minDate?: Date
	maxDate?: Date
	showCalendarValue?: boolean
	defaultValue?: RangeValue<Date>
	readOnly?: boolean
	onChange?: (v: RangeValue<DateValue>) => void
}

const RangeCalendar = ({
	ariaLabel,
	disablePastDates,
	disableWeekends,
	disableToday,
	minDate,
	maxDate,
	showCalendarValue,
	readOnly,
	defaultValue,
	onChange,
}: RangeCalendarProps) => {
	function CalendarValue() {
		const state = use(RangeCalendarStateContext)!
		const start = state?.value?.start?.toDate(getLocalTimeZone())
		const end = state?.value?.end?.toDate(getLocalTimeZone())

		const formatter = useDateFormatter({ dateStyle: 'long' })

		const formatted = start && end ? formatter.formatRange(start, end) : 'None'
		return (
			<div className="text-sm text-gray-500">
				Selected date range: <br /> {formatted}
			</div>
		)
	}

	const isDateUnavailable = (date: DateValue) => {
		return (
			// not a bug! https://react-spectrum.adobe.com/react-aria/RangeCalendar.html#unavailable-dates
			// by default, users may not select non-contiguous ranges, i.e. ranges that contain unavailable dates within them.
			(disableWeekends && isWeekend(date, 'en-US')) ||
			(disableToday && isSameDay(date, today(getLocalTimeZone()))) || // isToday throws on timezone/locale ?
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

	//default value
	const convertedDefaultValue = defaultValue
		? {
				start: convertToDateValue(defaultValue.start as Date) as CalendarDate,
				end: convertToDateValue(defaultValue.end as Date) as CalendarDate,
			}
		: null

	return (
		<RACRangeCalendar
			aria-label={ariaLabel || 'Select a date range'}
			className="w-fit border rounded-md p-2 bg-white"
			minValue={minValue || minDateToMinValue}
			maxValue={maxDateToMaxValue}
			isDateUnavailable={isDateUnavailable}
			isReadOnly={readOnly}
			defaultValue={convertedDefaultValue}
			onChange={onChange}
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
								'data-[disabled=true]:opacity-40 data-[disabled=true]:hover:border-none data-[disabled=true]:cursor-default',
								'data-[unavailable]:opacity-40 data-[unavailable]:hover:border-none data-[unavailable]:cursor-default',
								'focus:outline-black data-[selected]:bg-primary-500 data-[selected]:text-white',
								readOnly && 'opacity-75 cursor-default'
							)}
						/>
					)}
				</CalendarGridBody>
			</CalendarGrid>
			{showCalendarValue && <CalendarValue />}
		</RACRangeCalendar>
	)
}
// ------------------------------------- RangeCalendar export

export { RangeCalendar }
