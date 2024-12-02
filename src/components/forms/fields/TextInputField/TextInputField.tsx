import React from 'react'
import { TextInput } from '@/components/forms/inputs/TextInput'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- Input Field Types

export type TextInputFieldProps<T extends FieldValues> =
	React.InputHTMLAttributes<HTMLInputElement> & {
		control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
		name: Path<T> //react-hook-form.com/ts#FieldPath
		id: string
		className?: string
		label: string
		type?: 'email' | 'number' | 'password' | 'tel' | 'text'
		srOnlyLabel?: boolean
		placeholder?: string
		description?: string | React.ReactNode
		srOnlyDescription?: boolean
		disabled?: boolean
		required?: boolean
		showOptional?: boolean
	}

// ------------------------------------- TextInput Field

const TextInputField = <T extends FieldValues>({
	type = 'text',
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
	required = true,
	showOptional = true,
	...props
}: TextInputFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<FormControl>
							<TextInput
								label={label}
								srOnlyLabel={srOnlyLabel}
								id={id}
								type={type}
								placeholder={placeholder}
								error={!!error}
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								disabled={disabled || field.disabled}
								{...props} //allows html input properties to be passed down through ...props
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
TextInputField.displayName = 'TextInputField'

// ------------------------------------- Input Field Exports

export { TextInputField }
