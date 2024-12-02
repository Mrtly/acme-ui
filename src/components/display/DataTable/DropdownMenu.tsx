//TODO
'use client'
import React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export type DropdownMenuSubTriggerProps = DropdownMenuPrimitive.DropdownMenuSubTriggerProps & {
	inset?: boolean
}

const DropdownMenuSubTrigger = ({
	className,
	inset,
	children,
	...props
}: DropdownMenuSubTriggerProps) => {
	const styles = cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 data-[state=open]:bg-gray-100',
		inset && 'pl-8',
		className
	)

	return (
		<DropdownMenuPrimitive.SubTrigger className={styles} {...props}>
			{children}
			<Icon name="ChevronRight" size="sm" className="ml-auto" />
		</DropdownMenuPrimitive.SubTrigger>
	)
}

const DropdownMenuSubContent = ({
	className,
	...props
}: DropdownMenuPrimitive.DropdownMenuSubContentProps) => {
	const styles = cn(
		'z-50 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)

	return <DropdownMenuPrimitive.SubContent className={styles} {...props} />
}

const DropdownMenuContent = ({
	className,
	sideOffset = 4,
	...props
}: DropdownMenuPrimitive.DropdownMenuContentProps) => {
	const styles = cn(
		'z-50 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-900 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)

	return (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content sideOffset={sideOffset} className={styles} {...props} />
		</DropdownMenuPrimitive.Portal>
	)
}

export type DropdownMenuItemProps = DropdownMenuPrimitive.DropdownMenuItemProps & {
	inset?: boolean
}
const DropdownMenuItem = ({ className, inset, ...props }: DropdownMenuItemProps) => {
	const styles = cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-70',
		inset && 'pl-8',
		className
	)

	return <DropdownMenuPrimitive.Item className={styles} {...props} />
}

const DropdownMenuCheckboxItem = ({
	className,
	children,
	checked,
	...props
}: DropdownMenuPrimitive.DropdownMenuCheckboxItemProps) => {
	const checkboxItemStyles = cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-70',
		className
	)
	const indicatorWrapperStyles = 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center'

	return (
		<DropdownMenuPrimitive.CheckboxItem className={checkboxItemStyles} checked={checked} {...props}>
			<span className={indicatorWrapperStyles}>
				<DropdownMenuPrimitive.ItemIndicator>
					<Icon name="Check" size="sm" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.CheckboxItem>
	)
}

const DropdownMenuRadioItem = ({
	className,
	children,
	...props
}: DropdownMenuPrimitive.DropdownMenuRadioItemProps) => {
	const radioItemStyles = cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-70',
		className
	)

	const indicatorStyles = 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center'

	return (
		<DropdownMenuPrimitive.RadioItem className={radioItemStyles} {...props}>
			<span className={indicatorStyles}>
				<DropdownMenuPrimitive.ItemIndicator>
					<Icon name="Circle" size="sm" className="size-2 fill-current" />
				</DropdownMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</DropdownMenuPrimitive.RadioItem>
	)
}

export type DropdownMenuLabelProps = DropdownMenuPrimitive.DropdownMenuLabelProps & {
	inset?: boolean
}

const DropdownMenuLabel = ({ className, inset, ...props }: DropdownMenuLabelProps) => {
	const styles = cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)

	return <DropdownMenuPrimitive.Label className={styles} {...props} />
}

const DropdownMenuSeparator = ({
	className,
	...props
}: DropdownMenuPrimitive.DropdownMenuSeparatorProps) => {
	const styles = cn('-mx-1 my-1 h-px bg-gray-100', className)

	return <DropdownMenuPrimitive.Separator className={styles} {...props} />
}

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	const styles = cn('ml-auto text-sm tracking-widest opacity-70', className)

	return <span className={styles} {...props} />
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
}
