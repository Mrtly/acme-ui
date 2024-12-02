import React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

// Inspiration: https://ui.shadcn.com/docs/components/toggle
// Primitives: https://www.radix-ui.com/primitives/docs/components/toggle & https://www.radix-ui.com/primitives/docs/components/toggle-group

// ------------------------------------- Toggle Variants

const toggleVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors hover:bg-gray-200 hover:text-black focusVisibleRingStyles disabled:pointer-events-none disabled:opacity-70 data-[state=on]:bg-brand data-[state=on]:text-white',
	{
		variants: {
			variant: {
				default: 'bg-transparent text-black',
				outline: 'border border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900',
			},
			size: {
				default: 'h-10 px-3',
				sm: 'h-9 px-2.5',
				lg: 'h-11 px-5',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

// ------------------------------------- Toggle

const Toggle = React.forwardRef<
	React.ElementRef<typeof TogglePrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
		VariantProps<typeof toggleVariants> & {
			onChange: () => void
			isDefaultPressed?: boolean
			isPressed?: boolean
		}
>(({ className, variant, size, onChange, isPressed, isDefaultPressed, ...props }, ref) => {
	const styles = cn(toggleVariants({ variant, size, className }))

	return (
		<TogglePrimitive.Root
			ref={ref}
			className={styles}
			onPressedChange={onChange}
			defaultPressed={isDefaultPressed}
			pressed={isPressed}
			{...props}
		/>
	)
})

Toggle.displayName = TogglePrimitive.Root.displayName

// ------------------------------------- Toggle Exports

export { Toggle }
