'use client'
import { useCallback, useEffect, useState, type Ref } from 'react'
import {
	Button,
	DateInput,
	DateRangePicker as RACDateRangePicker,
	DateSegment,
	Dialog,
	Group,
	Label,
	Popover,
} from 'react-aria-components'
import {
	DateValue,
	getLocalTimeZone,
	isSameDay,
	isWeekend,
	parseDate,
	today,
} from '@internationalized/date'

import { RangeCalendar, RangeValue } from '../elements/RangeCalendar'
import { cn } from '@/utils/cn'
import { Icon } from '@/theme/Icons'

// uses DateRangePicker from Adobe's react-aria-components library
// (https://react-spectrum.adobe.com/react-aria/DateRangePicker.html)
// uses Adobe's @internationalized/date package (objects and functions for representing dates)
// (https://react-spectrum.adobe.com/internationalized/date/index.html)

// ------------------------------------- DateRangePicker

type DateRangePickerProps = {
	label: string
	onChange: (r: RangeValue<Date>) => void
	defaultValue?: RangeValue<Date>
	value?: RangeValue<Date>
	id?: string
	onValidation?: (v: boolean) => void
	error?: boolean
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	srOnlyLabel?: boolean
	showOptional?: boolean
	//calendar props
	showCalendarValue?: boolean
	disablePastDates?: boolean
	disableWeekends?: boolean
	disableToday?: boolean
	minDate?: Date
	maxDate?: Date
	onBlur?: () => void
}

/**
 * DateRangePicker combines two DateFields and a RangeCalendar popover to allow users to enter or select a date and time range.
 */
const DateRangePicker = ({
	ref,
	id,
	label,
	defaultValue,
	value,
	onChange,
	onValidation,
	error,
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
	onBlur,
	...props
}: DateRangePickerProps & {
	ref?: Ref<HTMLDivElement>
}) => {
	const [rangeValue, setRangeValue] = useState<RangeValue<DateValue> | null>(null)
	const [invalid, setInvalid] = useState(false)

	const convertToDateObj = (date: DateValue): Date => {
		return date?.toDate(getLocalTimeZone())
	}
	const convertToDateValue = (date: Date): DateValue => {
		return parseDate(date?.toISOString().split('T')[0])
	}

	const isDateUnavailable = useCallback(
		(date: DateValue | null): boolean => {
			if (date) {
				return (
					(disablePastDates && date < today(getLocalTimeZone())) ||
					(minDate && date < convertToDateValue(minDate)) ||
					(maxDate && date > convertToDateValue(maxDate)) ||
					(disableWeekends && isWeekend(date, 'en-US')) ||
					(disableToday && isSameDay(date, today(getLocalTimeZone()))) || // isToday throws on timezone/locale ?
					false
				)
			}
			return false
		},
		[disablePastDates, disableToday, minDate, maxDate, disableWeekends]
	)

	useEffect(() => {
		if (!rangeValue) return
		const result = isDateUnavailable(rangeValue?.start) || isDateUnavailable(rangeValue?.end)
		setInvalid(result)
		onValidation && onValidation(result)
	}, [rangeValue, isDateUnavailable, onValidation])

	const convertedDefaultValue = defaultValue
		? {
				start: convertToDateValue(defaultValue.start as Date),
				end: convertToDateValue(defaultValue.end as Date),
			}
		: null

	const convertRangeToDate = (r: RangeValue<DateValue>) => {
		return r.start && r.end
			? {
					start: convertToDateObj(r.start),
					end: convertToDateObj(r.end),
				}
			: null
	}

	return (
		<RACDateRangePicker
			defaultValue={convertedDefaultValue}
			value={
				value && {
					start: convertToDateValue(value.start as Date),
					end: convertToDateValue(value.end as Date),
				}
			}
			onChange={(r) => {
				setRangeValue(r)
				onChange(convertRangeToDate(r!) as RangeValue<Date>)
			}}
			isRequired={required}
			isDisabled={disabled}
			isReadOnly={readOnly}
			isDateUnavailable={isDateUnavailable}
			onBlur={onBlur}
			className="w-full"
		>
			<Label
				className={cn(
					'block labelStyles',
					srOnlyLabel && 'sr-only',
					disabled && 'text-gray-500 opacity-70'
				)}
			>
				{label}{' '}
				{!required && showOptional && <span className="text-gray-500 font-normal">(optional)</span>}
				{readOnly && <span className="sr-only">read-only</span>}
			</Label>
			<Group
				className={cn(
					'flex items-center justify-between min-w-fit w-full h-10 rounded-md text-black border border-black bg-white text-sm',
					'[&:has(:focus-visible)]:border-primary-500 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-offset-2 ring-primary-500',
					(error || invalid) && 'border-error-500',
					readOnly && 'bg-gray-200',
					disabled && 'opacity-70'
				)}
				data-testid="daterangepicker"
				id={id}
				{...props}
			>
				<div className="flex items-center w-fit min-w-fit">
					<DateInput slot="start" className="flex p-2">
						{(segment) => (
							<DateSegment
								ref={segment.type === 'month' ? ref : null} //RHF focus on month if field error
								segment={segment}
								className="px-1 rounded-md caret-primary-500 tracking-wide focus:outline-none focus:bg-gray-100 placeholder-shown:text-gray-500 placeholder-shown:italic"
							/>
						)}
					</DateInput>
					<span aria-hidden="true">-</span>
					<DateInput slot="end" className="flex p-2">
						{(segment) => (
							<DateSegment
								ref={segment.type === 'month' ? ref : null} //RHF focus on month if field error
								segment={segment}
								className="px-1 rounded-md caret-primary-500 tracking-wide focus:outline-none focus:bg-gray-100 placeholder-shown:text-gray-500 placeholder-shown:italic"
							/>
						)}
					</DateInput>
				</div>
				<Button
					className={cn(
						'outline-none h-10 rounded-r p-2 flex items-center bg-black text-white transition-colors duration-200 ',
						'hover:bg-primary-500 hover:text-white focus-visible:bg-primary-500 focus-visible:text-white',
						(disabled || readOnly) && 'disabled:cursor-not-allowed disabled:opacity-70'
					)}
				>
					<Icon name="Calendar" size="md" />
				</Button>
			</Group>
			<Popover>
				<Dialog>
					<RangeCalendar
						ariaLabel={label}
						disablePastDates={disablePastDates}
						disableWeekends={disableWeekends}
						disableToday={disableToday}
						minDate={minDate}
						maxDate={maxDate}
						showCalendarValue={showCalendarValue}
					/>
				</Dialog>
			</Popover>
		</RACDateRangePicker>
	)
}

export { DateRangePicker }
