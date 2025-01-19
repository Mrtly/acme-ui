import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
	'inline-flex items-center gap-1 w-fit rounded-full border px-2.5 py-0.5 text-sm whitespace-nowrap font-medium tracking-wide',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-gray-900 text-white',
				secondary: 'border-transparent bg-gray-200 text-black',
				info: 'border-transparent bg-brand text-white',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
	const styles = cn(badgeVariants({ variant }), className)

	return <span className={styles} {...props} />
}

export { Badge, badgeVariants }
