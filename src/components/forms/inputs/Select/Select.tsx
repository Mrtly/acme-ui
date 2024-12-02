'use client'
import React, { useContext, useEffect, useState } from 'react'
import {
	Button,
	Header,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
	ListBoxSection,
	Select as SelectComponent,
	SelectValue,
	ListBoxItemProps,
	SelectProps as SelectComponentProps,
	SelectStateContext,
	SelectContext,
} from 'react-aria-components'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// https://react-spectrum.adobe.com/react-aria/Select.html

// Select does not support the isReadOnly prop like in other react-aria components (ie Combobox, DatePicker)
// To support the same readOnly functionality, a custom 'readOnly' prop is added, which disables the Select but keeps the button focuseable
// for better screen-reader accessibility, 'required' and 'read-only' is added to the aria-label

// ------------------------------------- Select
type SelectProps<T extends object> = Omit<SelectComponentProps<T>, 'children' | 'placeholder'> & {
	label: string
	children: React.ReactNode
	placeholder?: string
	srOnlyLabel?: boolean
	showOptional?: boolean
	disabled?: boolean
	required?: boolean
	readOnly?: boolean
	className?: string
}

const Select = React.forwardRef<HTMLInputElement, SelectProps<object>>(
	(
		{
			label,
			children,
			placeholder = 'Select item',
			srOnlyLabel,
			showOptional,
			disabled,
			required,
			readOnly,
			className,
			...props
		},
		ref
	) => {
		function ReadState() {
			// this reads the context from within the Select so it can set the disabledKey
			// to disable the -- clear -- item if no value is selected (accessibility improvement)
			const state = useContext(SelectStateContext)
			useEffect(() => {
				state?.selectedItem ? setHasValue(true) : setHasValue(false)
			}, [state?.selectedItem])
			return <></>
		}
		const [hasValue, setHasValue] = useState(false)

		let customLabel = label
		//adds 'required' to the aria-label, otherwise it is not read by screen reader bc it is passed to a hidden select element
		if (required) customLabel = customLabel + ', required'
		//adds 'read-only' to the aria-label, as readOnly is not supported by the root component
		if (readOnly) customLabel = customLabel + ', read-only'

		return (
			<SelectComponent
				ref={ref}
				aria-label={customLabel}
				//the Select functionality is removed (disabled) in case of readOnly (but the button remains focusable, see below)
				isDisabled={disabled || readOnly}
				data-readonly={readOnly}
				isRequired={required}
				disabledKeys={hasValue ? undefined : ['']}
				className={cn(className)}
				{...props} //do not remove this
				placeholder={placeholder || 'Select item'}
			>
				<Label
					className={cn(
						'block mb-1 labelStyles',
						disabled && 'text-gray-500 opacity-70',
						srOnlyLabel && 'sr-only'
					)}
				>
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
				</Label>
				<ReadState /> {/* reads the context from within the Select */}
				<>{children}</>
			</SelectComponent>
		)
	}
)

Select.displayName = 'Select'

// -------------------------------------  SelectTrigger

type SelectTriggerProps = {
	id?: string
	showTrueValue?: boolean
	error?: boolean
	small?: boolean
	className?: string //Combobox uses this for the variant style change
}
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
	({ id, showTrueValue, error, small, className, ...props }, ref) => {
		const state = useContext(SelectStateContext)
		const ctx = useContext(SelectContext)
		// @ts-expect-error property exists
		const isReadOnly = ctx && ctx['data-readonly']
		// @ts-expect-error property exists
		const isReallyDisabled = ctx && ctx.isDisabled

		const isShowingPlaceholder =
			// @ts-expect-error property exists
			state?.selectedItem === null || state?.selectedItem?.value?.value === ''

		return (
			<Button
				id={id}
				type="button"
				className={cn(
					'w-full h-10 border border-black rounded-md text-sm p-2 flex justify-between gap-4 items-center',
					'bg-white focusVisibleRingStyles data-[disabled=true]:opacity-70',
					small && 'h-9',
					error && 'border-error',
					isReadOnly && 'bg-gray-200 cursor-default',
					className
				)}
				ref={ref}
				{...props}
				// this makes the Select 'readOnly' while allowing the button to be focusable
				isDisabled={isReadOnly ? false : isReallyDisabled}
				data-readonly={isReadOnly}
			>
				<SelectValue
					className={cn(
						'text-gray-800 data-[placeholder=true]:text-gray-500 whitespace-nowrap',
						'truncate overflow-hidden',
						isShowingPlaceholder && 'text-gray-500'
					)}
				>
					{showTrueValue && state?.selectedItem
						? state?.selectedItem?.key //the item value
						: null}
				</SelectValue>

				<Icon name="ChevronDown" size="sm" />
			</Button>
		)
	}
)
SelectTrigger.displayName = ' SelectTrigger'

// ------------------------------------- SelectContent

export type SelectContentProps = {
	maxHeight?: number | undefined //pixels

	children: React.ReactNode
	canClearSelection?: boolean
	className?: string //Combobox uses this for the variant style change
	listClassName?: string //Combobox uses this for the variant style change
}

const SelectContent = ({
	children,
	maxHeight = 500,
	canClearSelection,
	className,
	listClassName,
}: SelectContentProps) => {
	return (
		<Popover
			maxHeight={maxHeight}
			className={cn(
				'-mt-1.5 w-[--trigger-width] border border-gray-400 bg-white shadow-md rounded-md text-sm p-2',
				'entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out',
				'overflow-y-auto overflow-x-hidden',
				className
			)}
		>
			<ListBox className={cn('outline-none flex flex-col gap-y-1', listClassName)}>
				<>
					{canClearSelection && <SelectClearItem />}
					{children}
				</>
			</ListBox>
		</Popover>
	)
}

// ------------------------------------- SelectItem

// this component is also used by the Combobox

export type SelectItemProps = Omit<ListBoxItemProps, 'value'> & {
	value: string
	className?: string //Combobox uses this for the variant style change
	truncate?: boolean
}

function SelectItem({ value, className, children, truncate = true, ...props }: SelectItemProps) {
	return (
		<ListBoxItem
			id={value}
			textValue={children?.toString()}
			{...props}
			className={({ isFocused, isSelected }) =>
				`p-1 rounded-sm flex items-center gap-1
        focusVisibleRingStyles cursor-default text-gray
		    ${isFocused && 'focused'}
        ${!isSelected && 'focus-visible:bg-gray-100 hover:bg-gray-100'}
        ${isSelected && 'selected bg-black text-white'}
        ${className}`
			}
		>
			{({ isSelected }) => (
				<>
					<div>
						{isSelected ? (
							<Icon name="Check" size="sm" />
						) : (
							<div className="w-4" /> //empty div to hold the space (or the flex causes a shift if the name is long)
						)}
					</div>

					<div className={cn(truncate && 'whitespace-nowrap overflow-hidden truncate')}>
						{children as React.ReactNode}
					</div>
				</>
			)}
		</ListBoxItem>
	)
}

// ------------------------------------- SelectClearItem

const SelectClearItem = () => {
	const [placeholder, setPlaceholder] = useState()

	//use separate component to avoid infinite loop
	function ReadContext() {
		const state = useContext(SelectContext)
		useEffect(() => {
			// @ts-expect-error property exists
			setPlaceholder(state?.placeholder)
		}, [state])
		return <></>
	}

	return (
		<ListBoxItem
			id=""
			value={{ value: '' }}
			textValue={placeholder}
			className={({ isDisabled }) =>
				`w-full whitespace-nowrap py-1 h-7 text-center italic text-gray-400 hover:bg-gray-100 focus-visible:bg-gray-100 rounded-sm cursor-default outline-none 
		    ${isDisabled && 'opacity-70'}
        `
			}
		>
			<ReadContext />
			{placeholder || 'Select item'}
		</ListBoxItem>
	)
}

// ------------------------------------- SelectSection

export type SelectSectionProps = {
	title: string
	children: React.ReactNode
}

const SelectSection = ({ title, children }: SelectSectionProps) => {
	return (
		<ListBoxSection>
			<Header className="p-1 font-semibold text-gray-400 text-sm whitespace-nowrap">{title}</Header>
			{children}
		</ListBoxSection>
	)
}

// ------------------------------------- Select exports

export { Select, SelectTrigger, SelectContent, SelectItem, SelectSection }
