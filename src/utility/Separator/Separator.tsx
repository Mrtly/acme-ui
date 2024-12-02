import React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/utils/cn'

const Separator = ({
	className,
	orientation = 'horizontal',
	decorative,
	...props
}: SeparatorPrimitive.SeparatorProps) => {
	const styles = cn(
		'shrink-0 bg-gray-200',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className
	)

	return (
		<SeparatorPrimitive.Root
			decorative={decorative}
			orientation={orientation}
			className={styles}
			{...props}
		/>
	)
}

export { Separator }
