import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { DateRangePicker } from '@/components/inputs/DateRangePicker/DateRangePicker'
import { Control, FieldValues, Path } from 'react-hook-form'
import { RangeValue } from '@/components/inputs/elements/RangeCalendar'
import { z } from 'zod'

// ------------------------------------- DateRangePickerField

export type DateRangePickerFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	label: string
	id?: string
	defaultValue?: RangeValue<Date>
	srOnlyLabel?: boolean
	description?: string | ReactNode
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	srOnlyDescription?: boolean
	handleFieldError?: (error: string | null) => void
	className?: string
	//calendar props
	showCalendarValue?: boolean
	disablePastDates?: boolean
	disableWeekends?: boolean
	disableToday?: boolean
	minDate?: Date
	maxDate?: Date
}

/**
 * DateRangePickerField allows users to enter or select a date range. Must be used inside a Form.
 */
const DateRangePickerField = <T extends FieldValues>({
	control,
	className,
	label,
	id,
	defaultValue,
	name,
	description,
	disabled,
	readOnly,
	showOptional = true,
	required = true,
	srOnlyLabel,
	srOnlyDescription,
	showCalendarValue,
	disablePastDates,
	disableWeekends,
	disableToday,
	minDate = new Date(1900, 0, 1),
	maxDate,
	handleFieldError,
	...props
}: DateRangePickerFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])

	const handleValidation = (value: boolean) => {
		if (handleFieldError) handleFieldError(value ? 'The selected date is unavailable' : null)
	}

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<FormControl>
							<DateRangePicker
								id={id}
								label={label}
								defaultValue={defaultValue}
								onValidation={handleValidation}
								error={!!error}
								readOnly={readOnly}
								srOnlyLabel={srOnlyLabel}
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								disabled={disabled || field.disabled}
								{...props}
								// calendar props
								showCalendarValue={showCalendarValue}
								disablePastDates={disablePastDates}
								disableWeekends={disableWeekends}
								disableToday={disableToday}
								minDate={minDate}
								maxDate={maxDate}
								//field props
								ref={field.ref}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
						</FormControl>
						{description && (
							<FormDescription className={cn(srOnlyDescription && 'sr-only')}>
								{description}
							</FormDescription>
						)}
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	)
}

// ------------------------------------- DateRangePickerFieldSchema

const DateRangePickerFieldSchema = z
	.object(
		{
			start: z.date(),
			end: z.date(),
		},
		{ required_error: 'A date range is required' }
	)
	.refine((range) => range && range.start.getFullYear() > 1900 && range.end.getFullYear() > 1900, {
		message: 'End date must be after 1900',
	})

// ------------------------------------- DateRangePickerField export

export { DateRangePickerField, DateRangePickerFieldSchema }
