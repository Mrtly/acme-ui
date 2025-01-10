'use client'
import React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { cn } from '@/utils/cn'
import { Icon } from '@/theme/Icons'

// ------------------------------------- Context Menu

const ContextMenu = ContextMenuPrimitive.Root

// ------------------------------------- Context Menu Trigger

const ContextMenuTrigger = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>
>(({ className, ...props }, ref) => {
	const styles = cn('text-gray-500', className)

	return <ContextMenuPrimitive.Trigger ref={ref} className={styles} {...props} />
})
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName

// ------------------------------------- Context Menu Group

const ContextMenuGroup = ContextMenuPrimitive.Group

// ------------------------------------- Context Menu Portal

const ContextMenuPortal = ContextMenuPrimitive.Portal

// ------------------------------------- Context Menu Sub

const ContextMenuSub = ContextMenuPrimitive.Sub

// ------------------------------------- Context Menu Radio Group

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

// ------------------------------------- Context Menu Sub Trigger

const ContextMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
		inset?: boolean
	}
>(({ className, inset, children, ...props }, ref) => {
	const styles = cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 focus:text-gray-800 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-800',
		inset && 'pl-8',
		className
	)

	return (
		<ContextMenuPrimitive.SubTrigger ref={ref} className={styles} {...props}>
			{children}
			<Icon name="ChevronRight" size="sm" className="ml-auto" />
		</ContextMenuPrimitive.SubTrigger>
	)
})
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

// ------------------------------------- Context Menu Sub Content

const ContextMenuSubContent = ({
	className,
	...props
}: ContextMenuPrimitive.ContextMenuSubContentProps) => {
	const styles = cn(
		'z-50 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-800 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)

	return <ContextMenuPrimitive.SubContent className={styles} {...props} />
}

// ------------------------------------- Context Menu Content

const ContextMenuContent = ({
	className,
	...props
}: ContextMenuPrimitive.ContextMenuContentProps) => {
	const styles = cn(
		'z-50 min-w-32 overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-800 shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)

	return (
		<ContextMenuPrimitive.Portal>
			<ContextMenuPrimitive.Content className={styles} {...props} />
		</ContextMenuPrimitive.Portal>
	)
}

// ------------------------------------- Context Menu Item

const ContextMenuItem = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
		inset?: boolean
	}
>(({ className, inset, ...props }, ref) => {
	const styles = cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-gray-100 focus:text-gray-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-70',
		inset && 'pl-8',
		className
	)

	return <ContextMenuPrimitive.Item ref={ref} className={styles} {...props} />
})
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

// ------------------------------------- Context Menu Checkbox Item

const ContextMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => {
	const checkboxItemStyles = cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-70',
		className
	)
	const indicatorWrapperStyles = 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center'

	return (
		<ContextMenuPrimitive.CheckboxItem
			ref={ref}
			className={checkboxItemStyles}
			checked={checked}
			{...props}
		>
			<span className={indicatorWrapperStyles}>
				<ContextMenuPrimitive.ItemIndicator>
					<Icon name="Check" size="sm" />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.CheckboxItem>
	)
})
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

// ------------------------------------- Context Menu Radio Item

const ContextMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
	const radioItemStyles = cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-800 data-[disabled]:pointer-events-none data-[disabled]:opacity-70',
		className
	)
	const indicatorWrapperStyles = 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center'

	return (
		<ContextMenuPrimitive.RadioItem ref={ref} className={radioItemStyles} {...props}>
			<span className={indicatorWrapperStyles}>
				<ContextMenuPrimitive.ItemIndicator>
					<Icon name="Circle" size="sm" className="size-2 fill-current" />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.RadioItem>
	)
})
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

// ------------------------------------- Context Menu Label
export type ContextMenuLabelProps = ContextMenuPrimitive.ContextMenuLabelProps & {
	inset?: boolean
}

const ContextMenuLabel = ({ className, inset, ...props }: ContextMenuLabelProps) => {
	const styles = cn('px-2 py-1.5 text-sm font-semibold text-gray-800', inset && 'pl-8', className)

	return <ContextMenuPrimitive.Label className={styles} {...props} />
}

// ------------------------------------- Context Menu Separator

const ContextMenuSeparator = ({
	className,
	...props
}: ContextMenuPrimitive.ContextMenuSeparatorProps) => {
	const styles = cn('-mx-1 my-1 h-px bg-gray-200', className)

	return <ContextMenuPrimitive.Separator className={styles} {...props} />
}

// ------------------------------------- Context Menu Shortcut

const ContextMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	const styles = cn('ml-auto text-sm tracking-widest text-gray-500', className)

	return <span className={styles} {...props} />
}
ContextMenuShortcut.displayName = 'ContextMenuShortcut'

// ------------------------------------- Context Menu Exports

export {
	ContextMenu,
	ContextMenuTrigger,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuCheckboxItem,
	ContextMenuRadioItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuGroup,
	ContextMenuPortal,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuRadioGroup,
}
