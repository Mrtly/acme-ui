'use client'
import { ReactNode, Ref, useState, createContext, useContext, ButtonHTMLAttributes } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/utility/Popover'
import { ToggleGroup, ToggleGroupItem } from '@radix-ui/react-toggle-group'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// https://www.radix-ui.com/primitives/docs/components/toggle-group
// https://www.radix-ui.com/primitives/docs/components/popover

// ------------------------------------- MultiSelect Context

type MultiSelectContextType = {
	selectedItems: string[]
	setSelectedItems: (items: string[]) => void
	onChange: (s: string[]) => void
	disabled?: boolean
	label: string
	id?: string
	placeholder?: string
	error?: boolean
	required?: boolean
	showOptional?: boolean
	srOnlyLabel?: boolean
}

const MultiSelectContext = createContext<MultiSelectContextType | undefined>(undefined)

const useMultiSelectContext = () => {
	const context = useContext(MultiSelectContext)
	if (!context) {
		throw new Error('MultiSelect components must be used within a MultiSelect')
	}
	return context
}

// ------------------------------------- MultiSelect Item

export type MultiSelectItemType = {
	/** 'id' required. IDs are emitted in an Array when items are selected. */
	id: string
	/**  'name' required. The display name of the item. */
	name: string
	disabled?: boolean
	/** any other property */
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

export type MultiSelectItemProps = { item: MultiSelectItemType; disabled?: boolean }

/** Used in a MultiSelect. Has the role of "toggle button" with the "aria-pressed" property. Items must have 'id' and 'name' properties. */
const MultiSelectItem = ({ item, disabled }: MultiSelectItemProps) => {
	const { disabled: contextDisabled } = useMultiSelectContext()
	const isDisabled = item.disabled || disabled || contextDisabled

	//Storybook accessibility check shows a contrast error on the item
	//investigated, no visual issue, it may be a false positive coming from the Item primitive
	return (
		<ToggleGroupItem
			value={item.id}
			disabled={isDisabled}
			className="group w-full flex items-center gap-2 py-1 px-2 focus-visible:bg-gray-100 outline-none disabled:opacity-70"
		>
			<div
				className={cn(
					'block size-5 border-2 border-gray-600 rounded-sm',
					'group-data-[state="on"]:bg-black group-data-[state="on"]:border-0 group-data-[state="on"]:border-black group-data-[state="on"]:text-white',
					'group-data-[state="off"]:opacity-50 group-data-[state="off"]:[&_svg]:invisible'
				)}
			>
				<Icon name="Check" className="size-5" />
			</div>
			{item.name}
		</ToggleGroupItem>
	)
}

// ------------------------------------- MultiSelect Trigger

type MultiSelectTriggerProps = {
	ref?: Ref<HTMLButtonElement>
	className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const MultiSelectTrigger = ({ className, ref, ...props }: MultiSelectTriggerProps) => {
	const { selectedItems, id, label, placeholder, error, disabled } = useMultiSelectContext()

	const getValue = () => {
		const length = selectedItems?.length
		if (length === 1) {
			return `1 item selected`
		} else if (length > 1) {
			return `${length} items selected`
		} else return placeholder ?? 'Select items'
	}

	return (
		<PopoverTrigger
			{...props}
			ref={ref}
			id={id ?? label}
			aria-labelledby="multiselect-label"
			aria-describedby={`multiselect-value ${props['aria-describedby']}`}
			aria-haspopup="listbox"
			disabled={disabled}
			data-disabled={disabled}
			data-error={error}
			className={cn(
				'w-full flex items-center justify-between py-2 px-3',
				'group focusVisibleRingStyles border border-gray-600 rounded-md',
				'disabled:border-gray-500 disabled:cursor-not-allowed disabled:opacity-70',
				error && 'border-error-500',
				className
			)}
		>
			<div
				id="multiselect-value"
				className={cn(selectedItems.length > 0 ? 'text-gray-800' : 'text-gray-500')}
			>
				{getValue()}
			</div>
			<Icon
				name="ChevronDown"
				size="md"
				className={cn('transition-all duration-200 group-data-[state="open"]:rotate-180')}
			/>
		</PopoverTrigger>
	)
}

// ------------------------------------- MultiSelect Content

type MultiSelectContentProps = {
	children: ReactNode
	className?: string
}

const MultiSelectContent = ({ children, className }: MultiSelectContentProps) => {
	const { selectedItems, setSelectedItems, onChange } = useMultiSelectContext()

	return (
		<PopoverContent
			style={{ width: 'var(--radix-popover-trigger-width)' }}
			className={cn('p-0 bg-white border-gray-600', className)}
		>
			<ToggleGroup
				type="multiple"
				data-orientation="vertical"
				value={selectedItems}
				onValueChange={(value) => {
					setSelectedItems(value)
					onChange(value)
				}}
				className="flex flex-col gap-1 items-start p-1"
			>
				{children}
			</ToggleGroup>
		</PopoverContent>
	)
}

// ------------------------------------- MultiSelect

export type MultiSelectProps = {
	children: ReactNode
	label: string
	/** Item IDs are emitted in an Array when items are selected. */
	onChange: (s: string[]) => void
	id?: string
	placeholder?: string
	srOnlyLabel?: boolean
	error?: boolean
	disabled?: boolean
	required?: boolean
	showOptional?: boolean
	defaultValue?: string[]
	className?: string
}

/** A select input element for multiple selection. */
const MultiSelect = ({
	children,
	label,
	onChange,
	id,
	placeholder,
	srOnlyLabel,
	error,
	disabled,
	required,
	showOptional,
	defaultValue = [],
	className,
}: MultiSelectProps) => {
	const [selectedItems, setSelectedItems] = useState<Array<string>>(defaultValue)

	return (
		<MultiSelectContext.Provider
			value={{
				selectedItems,
				setSelectedItems,
				onChange,
				disabled,
				label,
				id,
				placeholder,
				error,
				required,
				showOptional,
				srOnlyLabel,
			}}
		>
			<div className={className}>
				<div
					id="multiselect-label"
					className={cn(
						'labelStyles',
						disabled && 'text-gray-500 opacity-70',
						srOnlyLabel && 'sr-only'
					)}
				>
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
				</div>
				<Popover>{children}</Popover>
			</div>
		</MultiSelectContext.Provider>
	)
}

// ------------------------------------- Export components

export { MultiSelect, MultiSelectTrigger, MultiSelectContent, MultiSelectItem }
