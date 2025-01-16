'use client'
import React, { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'
import {
	Label,
	CheckboxGroup as RACCheckboxGroup,
	type CheckboxGroupProps as RACCheckboxGroupProps,
} from 'react-aria-components'

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

const CheckboxGroup = ({
	children,
	label,
	srOnlyLabel,
	disabled,
	error,
	required,
	readOnly,
	showOptional,
	...props
}: CheckboxGroupProps) => {
	const groupRef = useRef<HTMLDivElement | null>(null)

	// custom focus because RAC does not support this
	// focus the first checkbox when error is called on the group field
	useEffect(() => {
		if (error)
			(groupRef.current?.querySelector('input[type="checkbox"]') as HTMLInputElement)?.focus()
	}, [error])

	return (
		<RACCheckboxGroup
			ref={groupRef}
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
				{!required && showOptional && <span className="text-gray-500 font-normal">(optional)</span>}
			</Label>
			{children}
		</RACCheckboxGroup>
	)
}

CheckboxGroup.displayName = 'CheckboxGroup'

export { CheckboxGroup }
