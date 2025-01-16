'use client'
import React, { useState } from 'react'
import { TextInput } from '@/components/forms/inputs/TextInput'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { Icon } from '@/theme/Icons'

// ------------------------------------- Password Field Types

export type PasswordFieldProps<T extends FieldValues> =
	React.InputHTMLAttributes<HTMLInputElement> & {
		control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
		name: Path<T> //react-hook-form.com/ts#FieldPath
		id?: string
		autoComplete?: 'current-password' | 'new-password' | 'off'
		className?: string
		label: string
		srOnlyLabel?: boolean
		placeholder?: string
		description?: string | React.ReactNode
		srOnlyDescription?: boolean
		disabled?: boolean
		required?: boolean
		showOptional?: boolean
		isCreateOrChangeField?: boolean
	}

// ------------------------------------- Password Field

const passowrdRules =
	'Password must be between 8 and 16 characters and contain at least 1 symbol, 1 uppercase letter, 1 lowercase letter, and 1 number'

const PasswordField = <T extends FieldValues>({
	control,
	name,
	id,
	autoComplete,
	label,
	srOnlyLabel,
	description,
	placeholder,
	className,
	srOnlyDescription,
	disabled,
	required = true,
	showOptional = true,
	isCreateOrChangeField,
	...props
}: PasswordFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])
	const [show, setShow] = useState(false)

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<FormControl>
							<div className="relative">
								<TextInput
									label={label}
									srOnlyLabel={srOnlyLabel}
									id={id}
									title={isCreateOrChangeField ? passowrdRules : ''} //read by screenreaders
									autoComplete={autoComplete}
									placeholder={placeholder}
									error={!!error}
									required={required} //default true
									showOptional={showOptional} //default true, if !required, the label will render '(optional)'
									className={cn(!show && 'tracking-wide text-lg')}
									disabled={disabled || field.disabled}
									{...props}
									type={show ? 'text' : 'password'} //type after ...props so it is overwritten
									ref={field.ref}
									name={field.name}
									value={field.value ?? ''} //ensure value is never undefined
									onChange={field.onChange}
									onBlur={field.onBlur}
								/>
								{field.value && (
									<button
										type="button"
										onClick={() => setShow(!show)}
										className="absolute bottom-3 right-2 text-gray-500"
										aria-label={show ? 'hide password' : 'show password'}
									>
										{show && <Icon name="Eye" size="sm" />}
										{!show && <Icon name="EyeOff" size="sm" />}
									</button>
								)}
							</div>
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
PasswordField.displayName = 'PasswordField'

export { PasswordField }
