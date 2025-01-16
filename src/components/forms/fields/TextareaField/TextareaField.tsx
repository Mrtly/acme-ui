import React from 'react'
import { Textarea } from '@/components/forms/inputs/Textarea'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- Textarea Field Types

export type TextareaFieldProps<T extends FieldValues> =
	React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
		control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
		name: Path<T> //react-hook-form.com/ts#FieldPath
		id?: string
		className?: string
		label: string
		srOnlyLabel?: boolean
		placeholder?: string
		description?: string | React.ReactNode
		srOnlyDescription?: boolean
		disabled?: boolean
		readOnly?: boolean
		required?: boolean
		showOptional?: boolean
	}

// ------------------------------------- Textarea Field

const TextareaField = <T extends FieldValues>({
	control,
	name,
	id,
	label,
	srOnlyLabel,
	description,
	placeholder,
	className,
	srOnlyDescription,
	disabled,
	readOnly,
	required = true,
	showOptional = true,
	...props
}: TextareaFieldProps<T>) => {
	const styles = cn('flex flex-col gap-2', className)

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<FormControl>
							<Textarea
								label={label}
								srOnlyLabel={srOnlyLabel}
								id={id}
								placeholder={placeholder}
								error={!!error}
								readOnly={readOnly}
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								disabled={disabled || field.disabled}
								{...props}
								ref={field.ref}
								name={field.name}
								value={field.value ?? ''} //ensure value is never undefined
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
TextareaField.displayName = 'TextareaField'

// ------------------------------------- Textarea Field Exports

export { TextareaField }
