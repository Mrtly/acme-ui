'use client'
import React, { ReactElement, useEffect } from 'react'
import { cn } from '@/utils/cn'
import {
	Label,
	CheckboxGroup as RACCheckboxGroup,
	type CheckboxGroupProps as RACCheckboxGroupProps,
} from 'react-aria-components'
import { CheckboxProps } from '../Checkbox'

type CheckboxGroupProps = Omit<RACCheckboxGroupProps, 'children'> & {
	children: React.ReactNode
	label?: string
	srOnlyLabel?: boolean
	disabled?: boolean
	error?: boolean
	required?: boolean
	readOnly?: boolean
	showOptional?: boolean
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
	(
		{ children, label, srOnlyLabel, disabled, error, required, readOnly, showOptional, ...props },
		ref
	) => {
		// -- Custom focus functionality for the first checkbox on field error
		//the error boolean prop is set by the RHF field in the group component
		const listOfChildren = React.Children.toArray(children)
		const firstCheckbox = listOfChildren.find((child) =>
			//a field description is also a child element but does not have a value,
			//so the first child with a value prop is the first checkbox
			Object.prototype.hasOwnProperty.call((child as ReactElement<CheckboxProps>).props, 'value')
		)
		const firstCheckboxId = firstCheckbox
			? (firstCheckbox as ReactElement<CheckboxProps>).props.id
			: undefined

		useEffect(() => {
			if (error && firstCheckboxId) {
				//if there is an error (set by the Field component through RHF), focus on the first checkbox
				document.getElementById(firstCheckboxId)?.focus()
			}
		}, [error, firstCheckboxId])
		// -- end custom focus

		return (
			<RACCheckboxGroup
				ref={ref}
				isDisabled={disabled}
				isRequired={required}
				isReadOnly={readOnly}
				{...props}
				className={cn(
					'flex flex-col gap-2 rounded-md w-full',
					error && 'border border-error rounded-lg p-2',
					disabled || (readOnly && 'opacity-75'),
					props.className
				)}
			>
				<Label className={cn('labelStyles', srOnlyLabel && 'sr-only')}>
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
				</Label>
				{children}
			</RACCheckboxGroup>
		)
	}
)

CheckboxGroup.displayName = 'CheckboxGroup'

export { CheckboxGroup }
