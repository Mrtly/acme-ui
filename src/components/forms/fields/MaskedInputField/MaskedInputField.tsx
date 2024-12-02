import React from 'react'
import { MaskedInput } from '@/components/forms/inputs/MaskedInput'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- Input Field Types

export type MaskedInputFieldProps<T extends FieldValues> =
	React.InputHTMLAttributes<HTMLInputElement> & {
		control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
		name: Path<T> //react-hook-form.com/ts#FieldPath
		id: string
		className?: string
		label: string
		placeholder?: string
		srOnlyLabel?: boolean
		description?: string | React.ReactNode
		srOnlyDescription?: boolean
		disabled?: boolean
		readOnly?: boolean
		maskType: 'account' | 'zip' | 'usd'
		required?: boolean
		showOptional?: boolean
	}

// ------------------------------------- MaskedInput Field

const MaskedInputField = <T extends FieldValues>({
	control,
	name,
	id,
	label,
	placeholder,
	srOnlyLabel,
	description,
	className,
	srOnlyDescription,
	disabled,
	readOnly,
	maskType,
	required = true,
	showOptional = true,
	...props
}: MaskedInputFieldProps<T>) => {
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
							<MaskedInput
								id={id}
								maskType={maskType}
								label={label}
								srOnlyLabel={srOnlyLabel}
								placeholder={placeholder}
								error={!!error}
								readOnly={readOnly}
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								disabled={disabled || field.disabled}
								{...props}
								ref={field.ref}
								name={field.name}
								value={field.value}
								onMaskedValueUpdate={field.onChange}
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
MaskedInputField.displayName = 'MaskedInputField'

// ------------------------------------- Input Field helpers

//zod schemas
import * as z from 'zod'

const MaskedInputAccountSchema = z
	.string()
	.regex(
		new RegExp(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/),
		'Enter a valid account number (0000-0000-0000-0000).'
	)

const MaskedInputZipSchema = z.string().regex(new RegExp(/^[0-9]{5}$/), 'Enter a valid ZIP code.')

type DataObject = {
	[key: string]: unknown
}

// ------------------------------------- Input Field exports

export { MaskedInputField, MaskedInputAccountSchema, MaskedInputZipSchema, type DataObject }
