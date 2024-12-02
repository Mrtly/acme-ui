import { cva } from 'class-variance-authority'
import buttonVariants from '@/components/buttons/Button/buttonVariants'

const iconButtonVariants = cva('', {
	variants: {
		variant: {
			primary: buttonVariants({ variant: 'primary' }),
			destructive: buttonVariants({ variant: 'destructive' }),
			secondary: buttonVariants({ variant: 'secondary' }),
			ghost: buttonVariants({ variant: 'ghost' }),
		},
		size: {
			xs: 'h-8  p-2', //used in DataTablePagination
			sm: 'h-9  p-2',
			md: 'h-10 p-3',
			lg: 'h-11 p-4',
		},
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md',
	},
})
export default iconButtonVariants
