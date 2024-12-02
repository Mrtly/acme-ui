'use client'
import React, { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/theme/Icons'
import { Label } from '@/components/forms/inputs/elements/Label'
import { inputStyles } from '../TextInput'

// This component only does the masking, no validation
// It should be used in Forms with react-hook-form and zod validation
// It is not using a native pattern attr as the Form component includes the noValidate attr (Zod should do the validation)

// ------------------------------------- MaskedInput Type

export type MaskedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string
	id: string
	srOnlyLabel?: boolean
	error?: boolean
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	showOptional?: boolean
	maskType: 'account' | 'zip' | 'phone' | 'ssn' | 'usd'

	onMaskedValueUpdate?: (value: string | number) => void //custom masked value listener
}

// ------------------------------------- MaskedInput

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
	(
		{
			maskType,
			id,
			label,
			srOnlyLabel,
			className,
			error,
			required,
			disabled,
			readOnly,
			showOptional,
			onMaskedValueUpdate,
			...props
		},
		ref
	) => {
		const styles = cn([
			inputStyles,
			error && 'border-error',
			maskType === 'usd' && 'pl-5',
			readOnly && 'bg-gray-200',
			className,
		])
		const labelClasses = cn({
			'text-gray-500 opacity-70': disabled,
		})

		//this is the value shown in the input
		const [maskedValue, setMaskedValue] = useState('')
		//this value is emitted after masking (for account/phone/zip it is a string including the '-' dashes added by the mask)
		//for USD this value is set as a string but the emitted value is the amount as a type Number

		const removeNonDigitChars = (value: string): string => {
			return value.replace(/\D/g, '')
		}

		const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
			const inputValue = (e.target as HTMLInputElement).value
			formatValue(inputValue)
		}

		useEffect(() => {
			if (props.value) {
				formatValue(props.value.toString())
			}
		}, []) //should run once only on mount

		const formatValue = (inputValue: string) => {
			const tempValue = removeNonDigitChars(inputValue)

			if (maskType === 'account') {
				if (tempValue.length <= 4) {
					inputValue = tempValue
				} else if (tempValue.length <= 8) {
					inputValue = `${tempValue.slice(0, 4)}-${tempValue.slice(4)}`
				} else if (tempValue.length <= 12) {
					inputValue = `${tempValue.slice(0, 4)}-${tempValue.slice(4, 8)}-${tempValue.slice(8)}`
				} else {
					inputValue = `${tempValue.slice(0, 4)}-${tempValue.slice(
						4,
						8
					)}-${tempValue.slice(8, 12)}-${tempValue.slice(12, 16)}`
				}
			} else if (maskType === 'phone') {
				if (tempValue.length <= 3) {
					inputValue = `(${tempValue}`
				} else if (tempValue.length <= 6) {
					inputValue = `(${tempValue.slice(0, 3)}) ${tempValue.slice(3)}`
				} else {
					inputValue = `(${tempValue.slice(0, 3)}) ${tempValue.slice(3, 6)}`
					if (tempValue.length > 6) {
						inputValue += `-${tempValue.slice(6, 10)}`
					}
				}
				// Remove parentheses if the phone number is empty
				if (tempValue.length === 0) {
					inputValue = ''
				}
			} else if (maskType === 'zip') {
				inputValue = tempValue
			} else if (maskType === 'ssn') {
				if (tempValue.length <= 3) {
					inputValue = tempValue
				} else if (tempValue.length <= 6) {
					inputValue = `${tempValue.slice(0, 3)}-${tempValue.slice(3)}`
				} else {
					inputValue = `${tempValue.slice(0, 3)}-${tempValue.slice(3, 5)}-${tempValue.slice(5, 9)}`
				}
			} else if (maskType === 'usd') {
				const numberValue: number = parseInt(tempValue, 10) / 100
				if (isNaN(numberValue)) return
				const formattedToUsd: string = numberValue.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})
				inputValue = formattedToUsd.split('$')[1]
				//for usd emit the value as number
				if (onMaskedValueUpdate) {
					onMaskedValueUpdate(numberValue)
				}
			}
			setMaskedValue(inputValue)
			//for other types emit the value as string
			if (onMaskedValueUpdate && maskType !== 'usd') {
				onMaskedValueUpdate(inputValue)
			}
		}

		const title =
			maskType === 'account'
				? '16-digit account number'
				: maskType === 'phone'
					? '10-digit phone number'
					: maskType === 'zip'
						? '5-digit zip code'
						: maskType === 'ssn'
							? 'Social Security Number'
							: maskType === 'usd'
								? 'dollar amount'
								: ''

		const maxLen =
			maskType === 'account'
				? 19
				: maskType === 'phone'
					? 14
					: maskType === 'zip'
						? 5
						: maskType === 'ssn'
							? 11
							: undefined

		const autocompleteStandardValue =
			maskType === 'account'
				? 'off'
				: maskType === 'phone'
					? 'tel-national'
					: maskType === 'zip'
						? 'postal-code'
						: maskType === 'ssn'
							? 'off'
							: 'off'

		return (
			<div className="relative">
				<Label htmlFor={id} srOnly={srOnlyLabel} className={labelClasses}>
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
				</Label>
				<input
					ref={ref}
					id={id}
					type={maskType === 'phone' ? 'tel' : 'text'}
					inputMode="numeric"
					title={title} //title is announced by screenreader like a description
					required={required}
					disabled={disabled}
					readOnly={readOnly}
					maxLength={maxLen}
					className={styles}
					autoComplete={props.autoComplete || autocompleteStandardValue}
					{...props} //allows other input props but does not override the below
					value={maskType === 'usd' ? maskedValue : props.value || maskedValue} //allows value to be set via prop/rhf field (but not for usd type)
					onChange={handleInput}
				/>
				{maskType === 'usd' && (
					<Icon
						name="DollarSign"
						size="sm"
						className="absolute bottom-[13px] left-1.5 text-gray-800 size-3.5"
					/>
				)}
			</div>
		)
	}
)
MaskedInput.displayName = 'MaskedInput'

// ------------------------------------- MaskedInput Exports

export { MaskedInput }
