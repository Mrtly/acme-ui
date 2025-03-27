import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { TimePicker } from '@/components/inputs/TimePicker/TimePicker'
import { z } from 'zod'

export const TimePickerFieldSchema = z.object(
	{
		hour: z.number(),
		minute: z.number(),
	},
	{ required_error: 'Time is required' }
)

export type TimePickerFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	label: string
	id?: string
	srOnlyLabel?: boolean
	description?: string | ReactNode
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	srOnlyDescription?: boolean
}

const TimePickerField = <T extends FieldValues>({
	control,
	label,
	name,
	description,
	disabled,
	readOnly,
	showOptional = true,
	required = true,
	srOnlyLabel,
	srOnlyDescription,
	className,
	...props
}: TimePickerFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])
	return (
		<FormField
			control={control}
			name={name as Path<T>}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<FormControl>
							<TimePicker
								label={label}
								error={!!error}
								readOnly={readOnly}
								srOnlyLabel={srOnlyLabel}
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								disabled={disabled || field.disabled}
								{...field}
								{...props}
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

export { TimePickerField }
