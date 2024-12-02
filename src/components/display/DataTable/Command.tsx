//TODO
'use client'
import React from 'react'
import { DialogProps } from '@radix-ui/react-dialog'
import { Command as CommandPrimitive } from 'cmdk'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'
import * as DialogPrimitive from '@radix-ui/react-dialog'

// https://ui.shadcn.com/docs/components/command
// https://cmdk.paco.me/

// ------------------------------------- Command

const Command = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => {
	const styles = cn(
		'flex size-full flex-col overflow-hidden rounded-md bg-white text-gray-900',
		className
	)

	return <CommandPrimitive ref={ref} className={styles} {...props} />
})
Command.displayName = CommandPrimitive.displayName

// ------------------------------------- Command Dialog

type CommandDialogProps = DialogProps

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
	const styles = cn([
		'[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5',
	])

	return (
		<DialogPrimitive.Root {...props}>
			<DialogPrimitive.Content className="overflow-hidden p-0 shadow-lg">
				<Command className={styles}>{children}</Command>
			</DialogPrimitive.Content>
		</DialogPrimitive.Root>
	)
}

// ------------------------------------- Command Input

const CommandInput = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Input>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => {
	const wrapperStyles =
		'flex items-center border-b px-3 border border-gray-800 rounded-md focus-within:border-brand focus-within:border-2'

	const inputStyles = cn(
		'flex h-11 w-full rounded bg-transparent px-1 py-2 text-sm border-none focus:ring-0 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-70',
		className
	)

	return (
		<div className={wrapperStyles} cmdk-input-wrapper="">
			<Icon name="Search" className="text-gray-400" />
			<CommandPrimitive.Input ref={ref} className={inputStyles} {...props} />
		</div>
	)
})

CommandInput.displayName = CommandPrimitive.Input.displayName

// ------------------------------------- Command List

const CommandList = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => {
	const styles = cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)

	return <CommandPrimitive.List ref={ref} className={styles} {...props} />
})

CommandList.displayName = CommandPrimitive.List.displayName

// ------------------------------------- Command Empty

const CommandEmpty = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Empty>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => {
	const styles = 'py-6 text-center text-sm'

	return <CommandPrimitive.Empty ref={ref} className={styles} {...props} />
})

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

// ------------------------------------- Command Group

const CommandGroup = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Group>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => {
	const styles = cn(
		'overflow-hidden p-1 text-gray-900 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500',
		className
	)

	return <CommandPrimitive.Group ref={ref} className={styles} {...props} />
})

CommandGroup.displayName = CommandPrimitive.Group.displayName

// ------------------------------------- Command Separator

const CommandSeparator = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => {
	const styles = cn('-mx-1 h-px bg-gray-200', className)
	return <CommandPrimitive.Separator ref={ref} className={styles} {...props} />
})
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

// ------------------------------------- Command Item

const CommandItem = React.forwardRef<
	React.ElementRef<typeof CommandPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => {
	const styles = cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100 aria-selected:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-70',
		className
	)

	return <CommandPrimitive.Item ref={ref} className={styles} {...props} />
})

CommandItem.displayName = CommandPrimitive.Item.displayName

// ------------------------------------- Command Shortcut

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
	const styles = cn('ml-auto text-sm tracking-widest text-gray-500', className)

	return <span className={styles} {...props} />
}
CommandShortcut.displayName = 'CommandShortcut'

// ------------------------------------- Command

export {
	Command,
	CommandDialog,
	CommandInput,
	CommandList,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandShortcut,
	CommandSeparator,
}
