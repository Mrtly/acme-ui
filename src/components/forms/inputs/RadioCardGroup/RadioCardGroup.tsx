'use client'
import React, { useEffect, useRef } from 'react'
import {
	Label,
	Radio as RACRadio,
	RadioGroup as RACRadioGroup,
	RadioGroupProps as RACRadioGroupProps,
	RadioProps as RACRadioProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

// https://react-spectrum.adobe.com/react-aria/RadioGroup.html

// RAC RadioGroup does not expose a focusable ref
// so it does not focus on the first radio when focus() is called bu RHF
// considering alternative solution or Radix primitives

// ------------------------------------ RadioCardGroup

type RadioCardGroupProps = Omit<RACRadioGroupProps, 'children'> & {
	legend: string
	children: React.ReactNode
	error?: boolean
	className?: string
	disabled?: boolean
	required?: boolean
	readOnly?: boolean
	showOptional?: boolean
	srOnlyLegend?: boolean
}

const RadioCardGroup = ({
	legend,
	children,
	error,
	className,
	disabled,
	required,
	readOnly,
	showOptional,
	srOnlyLegend,
	orientation = 'vertical',
	...props
}: RadioCardGroupProps) => {
	const styles = cn([
		'flex gap-2',
		error && 'border border-error-500 rounded-lg p-2',
		orientation === 'horizontal' && 'flex-row flex-wrap',
		orientation === 'vertical' && 'flex-col',
		className,
	])

	const groupRef = useRef<HTMLDivElement | null>(null)

	// custom focus because RAC does not support this
	// focus the first radio when error is called on the group field
	useEffect(() => {
		if (error) (groupRef.current?.querySelector('input[type="radio"]') as HTMLInputElement)?.focus()
	}, [error])

	return (
		<RACRadioGroup
			{...props}
			ref={groupRef}
			isDisabled={disabled}
			isRequired={required}
			isReadOnly={readOnly}
			className={styles}
			isInvalid={!!error}
			validationBehavior="aria"
		>
			<Label className={cn('labelStyles', srOnlyLegend && 'sr-only')}>
				{legend}{' '}
				{!required && showOptional && <span className="text-gray-500 font-normal">(optional)</span>}
				{readOnly && <span className="sr-only">read-only</span>}
			</Label>

			{children}
		</RACRadioGroup>
	)
}

RadioCardGroup.displayName = 'RadioCardGroup'

// ------------------------------------ RadioCard

export type RadioCardProps = Omit<RACRadioProps, 'value'> & {
	value: string
	label: React.ReactNode | string
	children?: React.ReactNode | string //for the field description
	className?: string
	disabled?: boolean
	rightSlot?: React.ReactNode | string
	bottomSlot?: React.ReactNode
}

const RadioCard = ({
	value,
	label,
	children,
	className,
	disabled,
	rightSlot,
	bottomSlot,
	...props
}: RadioCardProps) => {
	const wrapperStyles = cn(
		'w-full rounded-md flex items-start gap-4 border p-4 text-gray-800',
		'[&:has(:focus-visible)]:border-primary-500 [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-offset-2 ring-primary-500',
		'cursor-pointer [&:has(:disabled)]:cursor-default',
		disabled && 'opacity-75 cursor-not-allowed'
	)

	const labelStyles = cn([
		'flex items-center gap-2',
		//this is the radio circle
		'before:content-[""] before:shrink-0 before:block before:box-border before:size-6 before:border before:border-black',
		' before:bg-white before:rounded-full data-[selected="true"]:before:border-[7px] data-[readonly="true"]:before:bg-gray-200',
		//disabled, readonly styles
		'data-[disabled="true"]:opacity-70 cursor-not-allowed before:data-[disabled="true"]:border-gray-500',
		'data-[readonly="true"]:opacity-85 cursor-default before:data-[readonly="true"]:border-gray-500',
		'cursor-pointer data-[disabled="true"]:cursor-not-allowed data-[readonly="true"]:cursor-default',
		className,
	])

	const cardId = `radiocard-${label}`
	const selectRadio = () => {
		document.getElementById(cardId)?.querySelector('label')?.click()
	}

	return (
		<div id={cardId} className={wrapperStyles} onClick={selectRadio}>
			<div className="flex flex-col gap-1 w-full">
				<RACRadio {...props} value={value} isDisabled={disabled} className={labelStyles}>
					{label}
				</RACRadio>
				{/* this is the Field description - passed as children  */}
				{children && <div className="ml-8 text-sm text-gray-500">{children}</div>}

				{/* bottom side assets slot */}
				{bottomSlot && <div className="mt-2 ml-8">{bottomSlot}</div>}
			</div>

			{/* rightSlot element - passed as a prop */}
			{rightSlot && <div className="text-sm font-medium">{rightSlot}</div>}
		</div>
	)
}

// ------------------------------------- Radio Cards exports

export { RadioCardGroup, RadioCard }
