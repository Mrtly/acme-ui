import React from 'react'
import { TextInput } from '@/components/forms/inputs/TextInput'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- Email Field Types

export type EmailFieldProps<T extends FieldValues> = React.InputHTMLAttributes<HTMLInputElement> & {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	id: string
	autoComplete?: 'email' | 'off'
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

// ------------------------------------- Email Field

const EmailField = <T extends FieldValues>({
	control,
	name,
	id,
	autoComplete = 'email',
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
}: EmailFieldProps<T>) => {
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
								autoComplete={autoComplete}
								placeholder={placeholder}
								error={!!error}
								readOnly={readOnly}
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								disabled={disabled || field.disabled}
								{...props}
								type="email" //after ...props so it is not overwritten
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
EmailField.displayName = 'EmailField'

// ------------------------------------- Email Field Validation Schema

import * as z from 'zod'

const EmailFieldSchema = z
	.string()
	.min(1, { message: 'Enter a valid email address (name@example.com).' })
	.email('Enter a valid email address (name@example.com).')

// ------------------------------------- Email Field Exports

export { EmailField, EmailFieldSchema }
