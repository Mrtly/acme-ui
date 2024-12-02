import React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '@/utils/cn'

// Inspiration: https://ui.shadcn.com/docs/components/scroll-area
// Primitives: https://www.radix-ui.com/primitives/docs/components/scroll-area

// ------------------------------------- Scroll Area

export type ScrollAreaProps = ScrollAreaPrimitive.ScrollAreaProps & {
	hasTextContentOnly?: boolean
}

const ScrollArea = ({ className, children, hasTextContentOnly, ...props }: ScrollAreaProps) => {
	const rootStyles = cn(['relative overflow-hidden', className])
	const viewPortStyles = cn(['size-full rounded-[inherit]'])

	const viewportProps = hasTextContentOnly ? { tabIndex: 0 } : {}

	return (
		<ScrollAreaPrimitive.Root className={rootStyles} {...props}>
			<ScrollAreaPrimitive.Viewport
				className={viewPortStyles}
				data-testid="scrollarea-viewport"
				{...viewportProps}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	)
}

// ------------------------------------- Scroll Bar

const ScrollBar = ({
	className,
	orientation = 'vertical',
	...props
}: ScrollAreaPrimitive.ScrollAreaScrollbarProps) => {
	const styles = cn([
		'flex touch-none select-none transition-colors bg-gray-100',
		orientation === 'vertical' && 'h-full w-3 border-l border-l-transparent px-[2px] py-1',
		orientation === 'horizontal' && 'h-3 border-t border-t-transparent p-px',
		className,
	])

	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			orientation={orientation}
			className={styles}
			{...props}
		>
			<ScrollBarThumb />
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	)
}

// ------------------------------------- Scroll Bar Thumb (little thing that moves)

const ScrollBarThumb = () => {
	const style = cn(['relative flex-1 rounded-full bg-gray-300'])

	return <ScrollAreaPrimitive.ScrollAreaThumb className={style} />
}

// ------------------------------------- Scroll Exports

export { ScrollArea, ScrollBar }
