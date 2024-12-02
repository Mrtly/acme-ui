import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/utils/cn'

// Inspiration: https://ui.shadcn.com/docs/components/tooltip
// Primitives: https://www.radix-ui.com/primitives/docs/components/tooltip

// ------------------------------------- Tooltip

const Tooltip = ({ children }: { children: React.ReactNode }) => {
	return (
		<TooltipPrimitive.Provider>
			<TooltipPrimitive.Root>{children}</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	)
}

// ------------------------------------- Tooltip Trigger

const TooltipTrigger = TooltipPrimitive.Trigger

// ------------------------------------- Tooltip Content

const TooltipContent = ({
	className,
	sideOffset = 4,
	...props
}: TooltipPrimitive.TooltipContentProps) => {
	const styles = cn(
		'z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
		className
	)
	return <TooltipPrimitive.Content sideOffset={sideOffset} className={styles} {...props} />
}

// ------------------------------------- Tooltip Exports

export { Tooltip, TooltipTrigger, TooltipContent }
