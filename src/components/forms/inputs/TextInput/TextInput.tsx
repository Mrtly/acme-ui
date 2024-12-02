import React from 'react'
import { cn } from '@/utils/cn'
import { Label } from '@/components/forms/inputs/elements/Label'

// Inspiration: https://ui.shadcn.com/docs/components/input

// ------------------------------------- Input Types

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string
	id: string
	type?: 'text' | 'email' | 'number' | 'password' | 'tel' | 'search'
	srOnlyLabel?: boolean
	error?: boolean
	small?: boolean
	required?: boolean
	showOptional?: boolean
	disabled?: boolean
	readOnly?: boolean
}

// ------------------------------------- Input

// inputStyles also used by Command, MaskedInput, & Combobox components
export const inputStyles = cn([
	'flex h-10 w-full rounded-md border border-black bg-white px-3 py-2',
	'text-sm text-black placeholder:text-gray-400 focusVisibleRingStyles',
	'disabled:border-gray-500 disabled:cursor-not-allowed disabled:opacity-70',
])

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
	(
		{
			id,
			label,
			srOnlyLabel,
			className,
			type = 'text',
			error,
			small,
			required,
			showOptional,
			disabled,
			readOnly,
			...props
		},
		ref
	) => {
		const styles = cn([
			inputStyles,
			small && 'h-9',
			error && 'border-error',
			readOnly && 'bg-gray-200',
			className,
		])

		const labelClasses = cn({
			'text-gray-500 opacity-70': disabled,
		})

		return (
			<div>
				<Label htmlFor={id} srOnly={srOnlyLabel} className={labelClasses}>
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
					{readOnly && <span className="sr-only">read-only</span>}
				</Label>
				<input
					id={id}
					type={type}
					ref={ref}
					autoComplete={props.autoComplete}
					required={required}
					className={styles}
					disabled={disabled}
					readOnly={readOnly}
					{...props}
				/>
			</div>
		)
	}
)
TextInput.displayName = 'TextInput'

// ------------------------------------- Input Exports

export { TextInput }
