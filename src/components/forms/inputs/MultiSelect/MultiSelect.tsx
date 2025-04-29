'use client'
import {
	ReactNode,
	Ref,
	useState,
	createContext,
	useContext,
	ButtonHTMLAttributes,
	useEffect,
	RefObject,
} from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/utility/Popover'
import { ToggleGroup } from 'radix-ui'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'
import { ScrollArea } from '@/components/utility/ScrollArea'
import { useViewportHeight } from '../../../hooks/useViewportHeight'

// https://www.radix-ui.com/primitives/docs/components/toggle-group
// https://www.radix-ui.com/primitives/docs/components/popover

// ------------------------------------- MultiSelect Context

type MultiSelectContextType = {
	selectedItems: string[]
	setSelectedItems: (items: string[]) => void
	onChange: (s: string[]) => void
	label: string
	disabled?: boolean
	id?: string
	placeholder?: string
	error?: boolean
	required?: boolean
	showOptional?: boolean
	srOnlyLabel?: boolean
	/** number of pixels to set as maxHeight on the popover element */
	maxHeight?: number //pixels
	/** position info is used for the popover content height */
	triggerPosition?: {
		bottom: number
		top: number
	}
	setTriggerPosition: (position: { bottom: number; top: number }) => void
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
	/**  whether the item is disabled */
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

	//Storybook accessibility check may show a couple of incomplete items - no contrast or focus issue - warnings coming from the primitives
	return (
		<ToggleGroup.Item
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
				<Icon name="Check" className="size-5 group-data-[state='off']:invisible" />
			</div>
			{item.name}
		</ToggleGroup.Item>
	)
}

// ------------------------------------- MultiSelect Trigger

type MultiSelectTriggerProps = {
	ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>

/** Used with MultiSelect. Interactive component that triggers the MultiSelect dropdown display. */
const MultiSelectTrigger = ({ className, ref, ...props }: MultiSelectTriggerProps) => {
	const { selectedItems, id, label, placeholder, error, disabled, required, setTriggerPosition } =
		useMultiSelectContext()

	// measure and set position in the context to be read by the content popover
	const measurePosition = () => {
		const element =
			(ref as RefObject<HTMLButtonElement>)?.current || document.getElementById(id ?? label)
		if (element) {
			const rect = element.getBoundingClientRect()

			setTriggerPosition({
				bottom: rect.bottom,
				top: rect.top,
			})
		}
	}

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
			data-required={required}
			className={cn(
				'w-full flex items-center justify-between py-2 px-3 text-sm',
				'group focusVisibleRingStyles border border-gray-600 rounded-md',
				'disabled:border-gray-500 disabled:cursor-not-allowed disabled:opacity-70',
				error && 'border-error-500',
				className
			)}
			onClick={(e) => {
				measurePosition()
				if (props.onClick) props.onClick(e)
			}}
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
} & React.HTMLAttributes<HTMLDivElement>

/** Used with MultiSelect. Contains the selectable options. */
const MultiSelectContent = ({ children, className, ...props }: MultiSelectContentProps) => {
	const { selectedItems, setSelectedItems, onChange, maxHeight, triggerPosition } =
		useMultiSelectContext()

	const viewportHeight = useViewportHeight()

	// calculate height based on space available from the trigger position
	const calculatedHeight =
		viewportHeight && triggerPosition
			? Math.min(
					maxHeight ? maxHeight : viewportHeight - 40, // 20px padding top + 20px padding bottom
					// Use the maximum available space (either above or below)
					Math.max(
						viewportHeight - triggerPosition.bottom - 20, // space below with 20px padding
						triggerPosition.top - 20 // space above with 20px padding
					)
				)
			: viewportHeight
				? Math.min(
						maxHeight ? maxHeight : viewportHeight - 40, // 20px padding top + 20px padding bottom
						viewportHeight - 40 // fallback with 20px padding top + 20px padding bottom
					)
				: 0 // SSR fallback (Next)

	return (
		<PopoverContent
			{...props}
			style={{ width: 'var(--radix-popover-trigger-width)' }}
			className={cn('p-0 bg-white border-gray-600 rounded-md', className)}
			hideWhenDetached
		>
			<ScrollArea type="auto" areaMaxHeight={calculatedHeight}>
				<ToggleGroup.Root
					type="multiple"
					data-orientation="vertical"
					value={selectedItems}
					onValueChange={(value) => {
						setSelectedItems(value)
						onChange(value)
					}}
					className="flex flex-col gap-1 items-start p-1 text-sm"
				>
					{children}
				</ToggleGroup.Root>
			</ScrollArea>
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
	/** Initial value for uncontrolled component (only used if value is not provided) */
	defaultValue?: string[]
	/** Controlled component value - overrides internal state when provided */
	value?: string[]
	/** number of pixels to set as maxHeight on the popover element */
	maxHeight?: number //pixels
} & React.HTMLAttributes<HTMLDivElement>

/** A custom select input element for multiple selection. */
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
	value,
	className,
	maxHeight,
	...props
}: MultiSelectProps) => {
	const [selectedItems, setSelectedItems] = useState<Array<string>>(value || defaultValue)

	// Update internal state when value prop changes
	useEffect(() => {
		if (value !== undefined) {
			setSelectedItems(value)
		}
	}, [value])

	const handleSelectionChange = (newSelectedItems: string[]) => {
		setSelectedItems(newSelectedItems)
		onChange(newSelectedItems)
	}

	// Add state for trigger position
	const [triggerPosition, setTriggerPosition] = useState<
		{ bottom: number; top: number } | undefined
	>(undefined)

	return (
		<MultiSelectContext.Provider
			value={{
				selectedItems,
				setSelectedItems: handleSelectionChange,
				onChange,
				disabled,
				label,
				id,
				placeholder,
				error,
				required,
				showOptional,
				srOnlyLabel,
				maxHeight,
				triggerPosition,
				setTriggerPosition,
			}}
		>
			<div {...props} className={className}>
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
				<Popover modal>{children}</Popover>
			</div>
		</MultiSelectContext.Provider>
	)
}

// ------------------------------------- export MultiSelect components

export { MultiSelect, MultiSelectTrigger, MultiSelectContent, MultiSelectItem }
