import { cva } from 'class-variance-authority'

export const linkVariants = cva(
	'w-fit gap-1 text-brand hover:text-blue-800 transition-all duration-200 tracking-wide font-bold rounded-md focusVisibleRingStyles',
	{
		variants: {
			variant: {
				inline: 'underline underline-offset-2',
				action: 'flex items-center',
			},
			size: {
				sm: 'text-sm',
				md: 'text-base',
				lg: 'text-lg',
				xl: 'text-2xl',
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'action',
		},
	}
)
