'use client'
import React, { useEffect, useState } from 'react'
import { MaskedInput } from '@/components/forms/inputs/MaskedInput'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- SSN Field Types

export type MaskedSsnFieldProps<T extends FieldValues> =
	React.InputHTMLAttributes<HTMLInputElement> & {
		control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
		name: Path<T> //react-hook-form.com/ts#FieldPath
		id: string
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

// ------------------------------------- SSN Field

const MaskedSsnField = <T extends FieldValues>({
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
}: MaskedSsnFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])
	const [value, setValue] = useState('')
	const [mask, setMask] = useState('')
	const [showMasked, setshowMasked] = useState(false)

	const isValidSSNFormat = (ssn: string): boolean => {
		const ssnRegex = /^\d{3}-\d{2}-\d{4}$/
		return ssnRegex.test(ssn)
	}

	const starredMask = (ssn: string) => {
		return isValidSSNFormat(ssn)
			? ssn.substring(0, 7).replace(/\d/g, '*') + ssn.substring(7) // ***-**-6789
			: ssn
	}

	const handleInput = (value: string) => {
		setValue(value)
		setMask(starredMask(value))
	}

	useEffect(() => {
		if (control._defaultValues[name]) {
			setValue(control._defaultValues[name] || '')
			setMask(starredMask(control._defaultValues[name] || ''))
			setshowMasked(true)
		}
	}, []) //should run once only on mount

	const handleBlur = () => {
		setshowMasked(isValidSSNFormat(value) ? true : false)
	}

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
									maskType="ssn"
									label={label}
									srOnlyLabel={srOnlyLabel}
									placeholder={placeholder}
									id={id}
									error={!!error}
									data-mask={mask}
									data-ismasked={showMasked}
									required={required} //default true
									showOptional={showOptional} //default true, if !required, the label will render '(optional)'
									disabled={disabled || field.disabled}
									{...props}
									name={field.name}
									ref={field.ref}
									value={field.value ?? control._defaultValues[name]} //sets default value if it exists in form
									onMaskedValueUpdate={(v) => {
										field.onChange(v) //sets field value in RHF
										handleInput(v as string) //handles the mask value
									}}
									onFocus={() => setshowMasked(false)}
									onBlur={handleBlur}
								/>
							</FormControl>
							{showMasked && mask && (
								<div className="absolute bottom-1 py-1 px-2 rounded left-2 bg-white text-sm tracking-wider">
									{mask}
								</div>
							)}
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
MaskedSsnField.displayName = 'MaskedSsnField'

// ------------------------------------- SSN Field Validation Schema

import * as z from 'zod'

const MaskedSsnFieldSchema = z
	.string()
	.regex(new RegExp(/^[0-9]{3}-[0-9]{2}-[0-9]{4}$/), 'Enter a valid Social Security Number.')

// ------------------------------------- SSN Field Exports

export { MaskedSsnField, MaskedSsnFieldSchema }
