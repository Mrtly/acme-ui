'use client'
import React, { ReactElement, useEffect, useRef } from 'react'
import {
	Label,
	Radio,
	RadioGroup as RACRadioGroup,
	RadioGroupProps as RACRadioGroupProps,
	RadioProps as RACRadioProps,
} from 'react-aria-components'
import { cn } from '@/utils/cn'

// https://react-spectrum.adobe.com/react-aria/RadioGroup.html

// The react-aria-components maintainers have confirmed that the RadioGroup does not expose a focusable ref yet but they are considering adding it
// in the meantime this component uses custom focus logic

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

const RadioCardGroup = React.forwardRef<HTMLDivElement, RadioCardGroupProps>(
	(
		{
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
		},
		ref
	) => {
		const styles = cn([
			'flex gap-2',
			error && 'border border-error rounded-lg p-2',
			orientation === 'horizontal' && 'flex-row flex-wrap',
			orientation === 'vertical' && 'flex-col',
			className,
		])

		// -- Custom focus functionality for the first radio on field error
		//the error boolean prop is set by the RHF field in the RadioGroupField component
		const listOfChildren = React.Children.toArray(children)
		const firstRadio = listOfChildren.find((child) =>
			//a field description is also a child element but does not have a value,
			//so the first child with a value prop is the first radio button
			Object.prototype.hasOwnProperty.call((child as ReactElement<RadioCardProps>).props, 'value')
		)
		const firstRadioId = firstRadio
			? (firstRadio as ReactElement<RadioCardProps>).props.id
			: undefined

		useEffect(() => {
			if (error && firstRadioId) {
				//if there is an error (set by the Field component through RHF), focus on the first radio
				document.getElementById(firstRadioId)?.focus()
			}
		}, [error, firstRadioId])
		// -- end custom focus

		return (
			<RACRadioGroup
				{...props}
				ref={ref}
				isDisabled={disabled}
				isRequired={required}
				isReadOnly={readOnly}
				className={styles}
				isInvalid={!!error}
				validationBehavior="aria"
			>
				<Label className={cn('labelStyles', srOnlyLegend && 'sr-only')}>
					{legend}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
					{readOnly && <span className="sr-only">read-only</span>}
				</Label>

				{children}
			</RACRadioGroup>
		)
	}
)

RadioCardGroup.displayName = 'RadioCardGroup'

// ------------------------------------ RadioCard

type RadioCardProps = Omit<RACRadioProps, 'value'> & {
	id: string
	value: string
	label: React.ReactNode | string
	children?: React.ReactNode | string //for the field description
	className?: string
	disabled?: boolean
	rightSlot?: React.ReactNode | string
	bottomSlot?: React.ReactNode
}

const RadioCard = ({
	id,
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
		'[&:has(:focus-visible)]:border-brand [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-offset-2 ring-brand',
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

	//clicking on the card selects the radio
	const radioRef = useRef<HTMLLabelElement>(null)
	const selectRadio = () => radioRef?.current?.click()

	return (
		<div className={wrapperStyles} onClick={selectRadio}>
			<div className="flex flex-col gap-1 w-full">
				<Radio
					ref={radioRef}
					{...props}
					id={id}
					value={value}
					isDisabled={disabled}
					className={labelStyles}
				>
					{label}
				</Radio>
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
