import React from 'react'
import { MaskedInput } from '@/components/forms/inputs/MaskedInput'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { z } from 'zod'

// ------------------------------------- PhoneField Type

export type PhoneFieldProps<T extends FieldValues> = React.InputHTMLAttributes<HTMLInputElement> & {
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
	required?: boolean
	showOptional?: boolean
}

// ------------------------------------- PhoneField

const PhoneField = <T extends FieldValues>({
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
}: PhoneFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<div className="relative">
							<FormControl>
								<MaskedInput
									maskType="phone"
									label={label}
									srOnlyLabel={srOnlyLabel}
									placeholder={placeholder}
									id={id}
									autoComplete={props.autoComplete || 'tel-national'}
									onMaskedValueUpdate={field.onChange}
									required={required} //default true
									showOptional={showOptional} //default true, if !required, the label will render '(optional)'
									error={!!error}
									disabled={disabled || field.disabled}
									{...props}
									{...field}
								/>
							</FormControl>
						</div>
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
PhoneField.displayName = 'PhoneField'

// ------------------------------------- PhoneFieldSchema

const PhoneFieldSchema = z
	.string()
	.regex(new RegExp(/^\(\d{3}\) \d{3}-\d{4}$/), 'Enter a valid phone number.')

// ------------------------------------- PhoneField Export

export { PhoneField, PhoneFieldSchema }
