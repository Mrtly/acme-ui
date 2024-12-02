import React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '@/utils/cn'

// Inspiration: https://ui.shadcn.com/docs/components/popover
// Primitives: https://www.radix-ui.com/primitives/docs/components/popover

// ------------------------------------- Popover

const Popover = PopoverPrimitive.Root

// ------------------------------------- Popover Trigger

const PopoverTrigger = PopoverPrimitive.Trigger

// ------------------------------------- Popover Content

const PopoverContent = ({
	className,
	align = 'center',
	sideOffset = 4,
	...props
}: PopoverPrimitive.PopoverContentProps) => {
	const styles = cn(
		'z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-900 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)

	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				align={align}
				sideOffset={sideOffset}
				className={styles}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	)
}

// ------------------------------------- Popover Exports

export { Popover, PopoverTrigger, PopoverContent }
