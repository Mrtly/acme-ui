import React from 'react'
import { cn } from '@/utils/cn'
import { Label } from '@/components/forms/inputs/elements/Label'

// ------------------------------------- Textarea

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label: string
	id: string
	srOnlyLabel?: boolean
	error?: boolean
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
	showOptional?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			id,
			label,
			srOnlyLabel,
			error,
			required,
			disabled,
			readOnly,
			showOptional,
			className,
			...props
		},
		ref
	) => {
		const styles = cn(
			'flex min-h-[80px] w-full rounded-md border border-black bg-white px-3 py-2',
			'text-sm text-black placeholder:text-gray-400 focusVisibleRingStyles',
			'disabled:cursor-not-allowed disabled:border-gray-500 disabled:opacity-70',
			error && 'border-error',
			readOnly && 'bg-gray-200',
			className
		)
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
				<textarea
					ref={ref}
					id={id}
					className={styles}
					required={required}
					readOnly={readOnly}
					disabled={disabled}
					{...props}
				/>
			</div>
		)
	}
)
Textarea.displayName = 'Textarea'

// ------------------------------------- Textarea Exports

export { Textarea }
