'use client'
import React from 'react'
import { Checkbox as CheckboxComponent } from 'react-aria-components'
import { type CheckboxProps as CheckboxComponentProps } from 'react-aria-components'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// https://react-spectrum.adobe.com/react-aria/Checkbox.html

// ------------------------------------- Checkbox

export type CheckboxProps = CheckboxComponentProps & {
	id: string
	label: string
	value: string
	error?: boolean
	small?: boolean
	required?: boolean
	showOptional?: boolean
	disabled?: boolean
	readOnly?: boolean
	checked?: boolean //checked value
	defaultChecked?: boolean //default value
}

const Checkbox = React.forwardRef<HTMLLabelElement, CheckboxProps>(
	(
		{
			id,
			label,
			value,
			className,
			error,
			disabled,
			readOnly,
			small,
			required,
			showOptional,
			checked,
			defaultChecked,
			...props
		},
		ref
	) => {
		const rootStyles = cn(
			'group w-fit rounded-sm flex items-start gap-2',
			'disabled:cursor-not-allowed disabled:opacity-70',
			error && 'border-error',
			className
		)

		const checkboxStyles = cn(
			//focus ring around checkbox only, not incl. label
			'groupFocusVisibleRingStyles shrink-0 flex items-center rounded-sm border border-black bg-white',
			'group-data-[selected=true]:bg-black cursor-pointer',
			small ? 'size-5' : 'size-6',
			error && 'border-error',
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
				<div className={checkboxStyles}>
					<Icon name="Check" size={small ? 'sm' : 'md'} className={checkmarckStyles} />
				</div>
				{/* the CheckboxComponent is a <label> wrapper - only use labelStyles here, not Label */}
				<div className="labelStyles">
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
				</div>
			</CheckboxComponent>
		)
	}
)
Checkbox.displayName = 'Checkbox'

// ------------------------------------- Checkbox export

export { Checkbox }
