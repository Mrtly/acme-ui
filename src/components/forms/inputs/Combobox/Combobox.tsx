'use client'
import React from 'react'
import {
	Button,
	ComboBox as ComboboxComponent,
	ComboBoxProps as ComboboxComponentProps,
	Input,
	InputContext,
	Label,
} from 'react-aria-components'
import {
	SelectContent,
	SelectContentProps,
	SelectItem,
	SelectItemProps,
	SelectSection,
	SelectSectionProps,
} from '@/components/forms/inputs/Select'
import { Icon } from '@/theme/Icons'
import { inputStyles } from '@/components/forms/inputs/TextInput'
import { cn } from '@/utils/cn'

// https://react-spectrum.adobe.com/react-aria/ComboBox.html

// Combobox reuses the Content and Item components of Select

// ------------------------------------- Combobox

type ComboBoxProps<T extends object> = ComboboxComponentProps<T> & {
	label: string
	children: React.ReactNode
	srOnlyLabel?: boolean
	showOptional?: boolean
	disabled?: boolean
	required?: boolean
	readOnly?: boolean
}

const Combobox = <T extends object>({
	label,
	children,
	srOnlyLabel,
	showOptional,
	disabled,
	required,
	readOnly,
	...props
}: ComboBoxProps<T>) => {
	return (
		<ComboboxComponent isDisabled={disabled} isRequired={required} isReadOnly={readOnly} {...props}>
			<Label
				className={cn(
					'block mb-1 labelStyles',
					disabled && 'text-gray-500 opacity-70',
					srOnlyLabel && 'sr-only'
				)}
			>
				{label}{' '}
				{!required && showOptional && <span className="text-gray-500 font-normal">(optional)</span>}
			</Label>
			<>{children}</>
		</ComboboxComponent>
	)
}

// ------------------------------------- ComboboxTrigger

type ComboboxTriggerProps = {
	id: string
	placeholder?: string
	error?: boolean
	small?: boolean
	variant?: 'default' | 'search'
}

const ComboboxTrigger = React.forwardRef<HTMLInputElement, ComboboxTriggerProps>(
	({ id, error, small, variant = 'default', ...props }, ref) => {
		const inputCtx = React.useContext(InputContext)
		// @ts-expect-error property exists
		const readOnly = inputCtx?.readOnly === true

		const comboboxStyles = cn(
			inputStyles,
			'truncate',
			error && 'border-error',
			small && 'h-9',
			readOnly && 'bg-gray-200', // tailwind selector read-only: does not work?
			variant === 'default' && 'pr-11',
			variant === 'search' && small && 'pl-7',
			variant === 'search' && !small && 'pl-8' //todo: must truncate
		)

		return (
			<div className="flex items-center relative">
				{variant === 'search' && (
					<Icon
						name="Search"
						size={small ? 'sm' : 'md'}
						className={cn(
							'absolute left-1.5 transition-colors duration-100 text-gray-400',
							small ? 'bottom-[10px]' : 'bottom-2.5'
						)}
					/>
				)}
				<Input ref={ref} id={id} className={comboboxStyles} {...props} />
				{variant === 'default' && (
					<Button
						className={cn(
							'rounded-r-[5px] p-2 absolute right-px inset-y-px h-[calc(100%-2px)]',
							'bg-black hover:bg-brand text-white transition-colors duration-200',
							'data-[disabled=true]:opacity-70'
						)}
					>
						<Icon name="ChevronDown" size="md" />
					</Button>
				)}
			</div>
		)
	}
)
ComboboxTrigger.displayName = 'ComboboxTrigger'

// ------------------------------------- ComboboxContent

const ComboboxContent = ({
	children,
	maxHeight,
	variant = 'default',
	...props
}: SelectContentProps & {
	variant?: 'default' | 'search'
}) => {
	const searchVariantStyle = cn(variant === 'search' && 'p-0')
	const listSearchStyle = cn(variant === 'search' && 'gap-y-0')

	return (
		<SelectContent
			maxHeight={maxHeight}
			className={searchVariantStyle}
			listClassName={listSearchStyle}
			{...props}
		>
			{children}
		</SelectContent>
	)
}

// ------------------------------------- ComboboxItem

const ComboboxItem = ({
	children,
	value,
	variant = 'default',
	...props
}: SelectItemProps & {
	variant?: 'default' | 'search'
}) => {
	const searchVariantStyle = cn(
		variant === 'search' && 'p-3 [&:not(:last-child)]:border-b border-gray-300'
	)

	return (
		<SelectItem
			value={value}
			className={searchVariantStyle}
			truncate={variant === 'default'} //should not truncate search items - use case: address dropdown items should show full address
			{...props}
		>
			{children}
		</SelectItem>
	)
}

// ------------------------------------- ComboboxSection

const ComboboxSection = ({ children, ...props }: SelectSectionProps) => {
	return <SelectSection {...props}>{children}</SelectSection>
}

// ------------------------------------- Combobox exports

export { Combobox, ComboboxTrigger, ComboboxContent, ComboboxItem, ComboboxSection }
