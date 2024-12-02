'use client'
import React, { useContext } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Icon, type IconProps } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// ------------------------------------- RadioChipGroupProps

export type RadioChipGroupProps = React.ComponentPropsWithoutRef<
	typeof RadioGroupPrimitive.Root
> & {
	legend: string
	error?: boolean
	srOnlyLegend?: boolean
}
type RadioGroupRefProps = React.ElementRef<typeof RadioGroupPrimitive.Root>

// ------------------------------------- RadioChipGroup

const RadioChipGroup = React.forwardRef<RadioGroupRefProps, RadioChipGroupProps>(
	({ legend, error, required, className, srOnlyLegend, ...props }, ref) => {
		const childrenStyles = cn(
			'flex flex-col gap-6 group',
			error && 'border border-error rounded-lg p-2',
			className
		)

		return (
			<RadioGroupPrimitive.Root
				{...props}
				ref={ref}
				required={required}
				className={childrenStyles}
				aria-labelledby="legend"
			>
				<div id="legend" className={cn('labelStyles', srOnlyLegend && 'sr-only')}>
					{legend}
				</div>
				{props.children}
			</RadioGroupPrimitive.Root>
		)
	}
)
RadioChipGroup.displayName = 'RadioChipGroup'

// ------------------------------------- RadioChipGroup Section Context

const RadioChipGroupSectionContext = React.createContext<{
	sectionLabel: string
}>({ sectionLabel: '' })

// ------------------------------------- RadioChipGroupSection

const RadioChipGroupSection = ({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) => {
	return (
		<RadioChipGroupSectionContext.Provider value={{ sectionLabel: label }}>
			<div className="flex flex-col gap-2">
				<div className="labelStyles text-gray-800">{label}</div>

				<div className="flex flex-wrap items-center gap-2 w-full max-w-max">{children}</div>
			</div>
		</RadioChipGroupSectionContext.Provider>
	)
}

// -------------------------------------  Item Props

type RadioGroupItemProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
	children?: React.ReactNode
}
type RadioGroupItemRefProps = React.ElementRef<typeof RadioGroupPrimitive.Item>

export type ChipProps = RadioGroupItemProps & {
	id: string
	label: React.ReactNode | string
	iconName?: IconProps['name']
	disabled?: boolean
}

// ------------------------------------- RadioChip

const RadioChip = React.forwardRef<RadioGroupItemRefProps, ChipProps>(
	({ id, label, className, iconName, disabled, ...props }, ref) => {
		const rootStyles = cn([
			'p-2 h-12 rounded-xl border border-blue-800',
			'data-[state="checked"]:bg-blue-800 data-[state="checked"]:text-white',
			'data-[state="unchecked"]:bg-white data-[state="unchecked"]:text-blue-800',
			'transition-colors duration-200 focusVisibleRingStyles',
			!disabled &&
				'group-data-[disabled=false]:hover:bg-blue-800 group-data-[disabled=false]:hover:text-white',
			disabled ? 'cursor-not-allowed' : 'cursor-pointer',
			disabled && '!bg-gray-100 border-gray-400 !text-gray-500',
			'group-data-[disabled]:bg-gray-100 group-data-[disabled]:border-gray-400 group-data-[disabled]:text-gray-500',
			'disabled:cursor-not-allowed disabled:opacity-70',
			className,
		])

		const sectionCtx = useContext(RadioChipGroupSectionContext)
		const sectionLabel = sectionCtx?.sectionLabel

		return (
			<RadioGroupPrimitive.Item
				ref={ref}
				id={id}
				className={rootStyles}
				disabled={disabled}
				{...props}
			>
				<div className={cn('whitespace-nowrap flex items-center gap-2')}>
					{iconName && <Icon name={iconName} size="md" />}
					{label}
					{sectionLabel && (
						// for screen-readers, the section label is added to each radio as sr-only
						<div className="sr-only">{sectionLabel}</div>
					)}
				</div>
			</RadioGroupPrimitive.Item>
		)
	}
)

RadioChip.displayName = 'RadioChip'

// ------------------------------------- exports

export { RadioChipGroup, RadioChipGroupSection, RadioChip }
