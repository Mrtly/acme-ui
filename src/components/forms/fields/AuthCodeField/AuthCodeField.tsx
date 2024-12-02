import React from 'react'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '@/utils/cn'
import {
	AuthCodeInput,
	AuthCodeInputProps,
} from '@/components/forms/inputs/AuthCodeInput/AuthCodeInput'
import { z } from 'zod'

// ------------------------------------- AuthCodeField

type AuthCodeFieldProps<T extends FieldValues> = AuthCodeInputProps & {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	label?: string
	description?: string
	srOnlyDescription?: boolean
	error?: boolean
}

const AuthCodeField = <T extends FieldValues>({
	control,
	name,
	label,
	srOnlyLabel,
	description,
	srOnlyDescription,
	error,
}: AuthCodeFieldProps<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormItem>
					<FormControl>
						<AuthCodeInput
							ref={field.ref}
							value={field.value}
							name={field.name}
							onChange={field.onChange}
							label={label}
							error={error || !!fieldState.error}
							srOnlyLabel={srOnlyLabel}
							descriptionId={`${name}-description`} //manually connect to description
							required
						/>
					</FormControl>
					{description && (
						<FormDescription
							id={`${name}-description`}
							className={cn(srOnlyDescription && 'sr-only')}
						>
							{description}
						</FormDescription>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

const AuthCodeFieldSchema = z
	.string({
		required_error: 'Enter the 6-digit code.',
	})
	.min(1, 'Enter the 6-digit code.')
	.min(6, 'Code must be 6 digits.')
	.max(6, 'Code must be 6 digits.')

// ------------------------------------- export

export { AuthCodeField, AuthCodeFieldSchema }
