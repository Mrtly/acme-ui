'use client'
import React from 'react'
import { Checkbox as CheckboxComponent } from 'react-aria-components'
import { type CheckboxProps as CheckboxComponentProps } from 'react-aria-components'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// https://react-spectrum.adobe.com/react-aria/Checkbox.html

// ------------------------------------- CheckboxCard

export type CheckboxCardProps = CheckboxComponentProps & {
	id: string
	label: string
	value: string
	/**
	 * for the field description
	 */
	children?: React.ReactNode
	error?: boolean
	required?: boolean
	showOptional?: boolean
	disabled?: boolean
	readOnly?: boolean
	/**
	 * controlled checked value
	 */
	checked?: boolean
	/**
	 * default value
	 */
	defaultChecked?: boolean
	/**
	 * content on the right side of the checkbox card
	 */
	rightSlot?: React.ReactNode
	/**
	 * reverses the row order of checkbox and label
	 */
	rowReverse?: boolean
	/**
	 * reverses the column order of checkbox/label and description
	 */
	colReverse?: boolean
}

const CheckboxCard = React.forwardRef<HTMLLabelElement, CheckboxCardProps>(
	(
		{
			id,
			label,
			value,
			children,
			className,
			error,
			disabled,
			readOnly,
			required,
			showOptional,
			checked,
			defaultChecked,
			rightSlot,
			rowReverse,
			colReverse,
			...props
		},
		ref
	) => {
		const rootStyles = cn([
			'group w-full rounded-lg flex items-start gap-4 bg-white border p-4 focusVisibleRingStyles',
			'disabled:cursor-not-allowed disabled:opacity-70',
			error && 'border-error',
			readOnly ? 'cursor-default' : ' cursor-pointer',
			className,
		])

		const checkboxStyles = cn(
			'shrink-0 size-6 flex gap-4 rounded-sm border border-black bg-white',
			'group-data-[selected=true]:bg-black cursor-pointer',
			disabled && 'cursor-not-allowed opacity-75',
			readOnly &&
				'cursor-default bg-gray-200 border-gray-500 group-data-[selected=true]:bg-gray-500'
		)

		const checkmarckStyles = cn(
			'hidden group-data-[selected=true]:block group-data-[selected=true]:text-white'
		)

		return (
			<CheckboxComponent
				ref={ref}
				id={id}
				value={value}
				isDisabled={disabled}
				isRequired={required}
				isReadOnly={readOnly}
				isSelected={checked}
				defaultSelected={defaultChecked}
				{...props}
				className={rootStyles}
			>
				<div className={cn('flex flex-col gap-1 w-full', colReverse && 'flex-col-reverse')}>
					<div
						className={cn(
							'flex items-start gap-2 w-full',
							rowReverse && 'flex-row-reverse justify-between'
						)}
					>
						<div className={checkboxStyles}>
							<Icon name="Check" size="md" className={checkmarckStyles} />
						</div>
						<div className="flex flex-col gap-2">
							{/* the CheckboxComponent is a <label> wrapper - only use labelStyles here, not Label */}
							<div className="labelStyles">
								{label}{' '}
								{!required && showOptional && (
									<span className="text-gray-500 font-normal">(optional)</span>
								)}
							</div>
						</div>
					</div>

					{/* field description slot */}
					{children && (
						<div className={cn('text-gray-500 text-sm', !rowReverse && 'ml-8')}>{children}</div>
					)}
				</div>
				{/* right side slot */}
				{rightSlot && <div className="text-sm font-medium"> {rightSlot}</div>}
			</CheckboxComponent>
		)
	}
)
CheckboxCard.displayName = 'CheckboxCard'

// ------------------------------------- CheckboxCard export

export { CheckboxCard }
