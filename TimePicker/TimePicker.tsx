'use client'
import { Ref } from 'react'
import { TimeField, Label, DateInput, DateSegment, TimeFieldProps } from 'react-aria-components'
import { Time } from '@internationalized/date'
import { inputStyles } from '../TextInput'
import { cn } from '@/utils/cn'

export type TimePickerProps = {
	label: string
	srOnlyLabel?: boolean
	disabled?: boolean
	ref?: Ref<HTMLInputElement>
	required?: boolean
	showOptional?: boolean
	error?: boolean
	readOnly?: boolean
} & TimeFieldProps<Time>

const TimePicker = ({
	ref,
	label = 'Time',
	srOnlyLabel,
	disabled,
	defaultValue,
	onChange,
	required,
	showOptional,
	error,
	value,
	readOnly,
}: TimePickerProps) => {
	const classNames = cn(
		inputStyles,
		'w-full flex gap-2 items-center focusVisibleRingStyles',
		'[&:has(:focus-visible)]:border-primary-500 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-offset-2 ring-primary-500',
		error && 'border-error-500',
		readOnly && 'text-gray-500 border-gray-500',
		disabled && 'text-gray-500 opacity-70'
	)

	return (
		<TimeField
			defaultValue={defaultValue}
			value={value}
			onChange={onChange}
			isRequired={required}
			isDisabled={disabled}
			isReadOnly={readOnly}
		>
			<Label
				className={cn(
					'block labelStyles',
					srOnlyLabel && 'sr-only',
					disabled && 'text-gray-500 opacity-70',
					!showOptional && 'required:after:content-["*"]',
					readOnly && 'text-gray-500'
				)}
			>
				{label}{' '}
				{!required && showOptional && <span className="text-gray-500 font-normal">(optional)</span>}
			</Label>
			<DateInput className={classNames} data-testid="timepicker">
				{(segment) => (
					<DateSegment
						ref={segment.type === 'hour' || segment.type === 'minute' ? ref : null} //RHF focus on hour or minute if field error
						segment={segment}
						className={cn(
							'text-black p-1 -m-1.5 rounded-md caret-primary-500 tracking-wide',
							disabled && 'text-gray-500',
							readOnly && 'text-gray-500',
							'focus:outline-none focus:bg-gray-100 placeholder-shown:text-gray-500 placeholder-shown:italic'
						)}
					/>
				)}
			</DateInput>
		</TimeField>
	)
}

export { TimePicker }
