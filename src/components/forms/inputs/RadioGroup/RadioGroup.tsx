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
// so it does not focus on the first radio when focus() is called by RHF
// considering alternative solution or Radix primitives

// ------------------------------------ RadioGroup

type RadioGroupProps = Omit<RACRadioGroupProps, 'children'> & {
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

const RadioGroup = ({
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
}: RadioGroupProps) => {
	const styles = cn([
		'max-w-max flex items-start gap-2',
		error && 'border border-error rounded-lg p-2',
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

RadioGroup.displayName = 'RadioGroup'

// ------------------------------------ Radio

type RadioProps = Omit<RACRadioProps, 'value'> & {
	id?: string
	value: string
	label: React.ReactNode | string
	className?: string
	disabled?: boolean
}

const Radio = ({ id, value, label, className, disabled, ...props }: RadioProps) => {
	const rootStyles = cn([
		'group w-fit rounded-full pr-1 flex items-center justify-start gap-2 text-gray-800',
		'disabled:cursor-not-allowed disabled:opacity-70',
		//this is the radio circle
		'before:content-[""] before:shrink-0 before:block before:box-border before:size-6 before:border before:border-black',
		' before:bg-white before:rounded-full data-[selected="true"]:before:border-[7px] data-[readonly="true"]:before:bg-gray-200',
		//focus-visible ring shown only on radio circle, not incl. label
		'before:ring-offset-white before:outline-none before:focus-visible:ring-2 before:focus-visible:ring-brand before:focus-visible:ring-offset-2',
		//disabled, readonly styles
		'data-[disabled="true"]:opacity-70 cursor-not-allowed before:data-[disabled="true"]:border-gray-500',
		'data-[readonly="true"]:opacity-85 cursor-default before:data-[readonly="true"]:border-gray-500',
		'cursor-pointer data-[disabled="true"]:cursor-not-allowed data-[readonly="true"]:cursor-default',
		className,
	])

	return (
		<RACRadio {...props} id={id} value={value} isDisabled={disabled} className={rootStyles}>
			{label}
		</RACRadio>
	)
}

// ------------------------------------- RadioGroup exports

export { RadioGroup, Radio }
