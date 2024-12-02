'use client'
import React, { useCallback, useEffect, useState } from 'react'
import {
	Button,
	DateInput,
	DatePicker as DatePickerComponent,
	DateSegment,
	DateValue,
	Dialog,
	Group,
	Label,
	Popover,
	useLocale,
} from 'react-aria-components'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'
import { Calendar } from '@/components/forms/inputs/elements/Calendar/Calendar'
import { getLocalTimeZone, isSameDay, isWeekend, parseDate, today } from '@internationalized/date'

// uses DatePicker from Adobe's react-aria-components library
// (https://react-spectrum.adobe.com/react-aria/DatePicker.html)
// uses Adobe's @internationalized/date package (objects and functions for representing dates)
// (https://react-spectrum.adobe.com/internationalized/date/index.html)

// ------------------------------------- DatePicker

type DatePickerProps = {
	id: string
	label: string
	defaultValue?: Date
	value?: Date | null //for controlled component

	onDateChange: (d: Date | undefined) => void

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

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
	(
		{
			id,
			label,
			defaultValue,
			value,
			onDateChange,
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
		},
		ref
	) => {
		const [dateValue, setDateValue] = useState<DateValue | null>()
		const [invalid, setInvalid] = useState(false)

		const convertToDateObj = (date: DateValue): Date => {
			return date?.toDate(getLocalTimeZone())
		}
		const convertToDateValue = (date: Date): DateValue => {
			return parseDate(date?.toISOString().split('T')[0])
		}

		const { locale } = useLocale()
		const isDateUnavailable = useCallback(
			(date: DateValue): boolean => {
				if (date) {
					return (
						(disablePastDates && date < today(getLocalTimeZone())) ||
						(minDate && date < convertToDateValue(minDate)) ||
						(maxDate && date > convertToDateValue(maxDate)) ||
						(disableWeekends && isWeekend(date, locale)) ||
						(disableToday && isSameDay(date, today(getLocalTimeZone()))) || // TODO: isToday throws on timezone/locale ?
						false
					)
				}
				return false
			},
			[disablePastDates, disableToday, minDate, maxDate, locale, disableWeekends]
		)

		useEffect(() => {
			const result = isDateUnavailable(dateValue!)
			setInvalid(result)
			onValidation && onValidation(result)
		}, [dateValue, isDateUnavailable, onValidation])

		return (
			<DatePickerComponent
				defaultValue={defaultValue && convertToDateValue(defaultValue)}
				value={value && convertToDateValue(value)}
				onChange={(d) => {
					setDateValue(d)
					onDateChange?.(convertToDateObj(d as DateValue))
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
						'block mb-1 labelStyles',
						srOnlyLabel && 'sr-only',
						disabled && 'text-gray-500 opacity-70'
					)}
				>
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
					{readOnly && <span className="sr-only">read-only</span>}
				</Label>
				<Group
					className={cn(
						'flex min-w-[144px] w-full h-10 rounded-md text-black border border-black bg-white text-sm',
						'[&:has(:focus-visible)]:border-brand [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-offset-2 ring-brand',
						(error || invalid) && 'border-error',
						readOnly && 'bg-gray-200',
						disabled && 'opacity-70'
					)}
					data-testid="datepicker"
					id={id}
					{...props}
				>
					<DateInput className="w-full flex p-2">
						{(segment) => (
							<DateSegment
								ref={segment.type === 'month' ? ref : null} //RHF focus on month if field error
								segment={segment}
								className="px-0.5 caret-brand tracking-wide focus:outline-none focus:bg-gray-100 placeholder-shown:text-gray-500 placeholder-shown:italic"
							/>
						)}
					</DateInput>
					<Button
						className={cn(
							'outline-none rounded-r p-2 flex items-center bg-black text-white transition-colors duration-200 ',
							'hover:bg-brand hover:text-white focus-visible:bg-brand focus-visible:text-white',
							(disabled || readOnly) && 'disabled:cursor-not-allowed disabled:opacity-70'
						)}
					>
						<Icon name="Calendar" size="md" />
					</Button>
				</Group>
				<Popover
					className={({ isEntering, isExiting }) => `
        ${
					isEntering &&
					'animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 ease-out duration-200'
				}
        ${
					isExiting &&
					'animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 ease-in duration-150'
				}
      `}
				>
					<Dialog>
						<Calendar
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
			</DatePickerComponent>
		)
	}
)
DatePicker.displayName = 'DatePicker'

// ------------------------------------- DatePicker export

export { DatePicker }
