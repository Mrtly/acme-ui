import React from 'react'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { DatePicker } from '@/components/forms/inputs/DatePicker/DatePicker'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- DatePickerField

export type DatePickerFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	id: string
	defaultValue?: Date
	label: string
	srOnlyLabel?: boolean
	description?: string | React.ReactNode
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	srOnlyDescription?: boolean
	//calendar props
	showCalendarValue?: boolean
	disablePastDates?: boolean
	disableWeekends?: boolean
	disableToday?: boolean
	minDate?: Date
	maxDate?: Date

	handleFieldError?: (error: string | null) => void
}

const DatePickerField = <T extends FieldValues>({
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
	minDate,
	maxDate,
	handleFieldError,
	...props
}: DatePickerFieldProps<T>) => {
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
							<DatePicker
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
								value={field.value ?? null} //ensure value is never undefined
								onDateChange={field.onChange}
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

DatePickerField.displayName = 'DatePickerField'

// ------------------------------------- DatePickerField export

export { DatePickerField }
