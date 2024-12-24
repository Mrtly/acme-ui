import { cva } from 'class-variance-authority'

//buttonVariants also used in IconButton

const buttonVariants = cva(
	'px-6 py-0 text-xl flex gap-1 items-center justify-center tracking-wide whitespace-nowrap font-bold disabled:cursor-not-allowed rounded-md focusVisibleRingStyles transition-all duration-200 active:scale-[97%]',
	{
		variants: {
			variant: {
				primary:
					'bg-brand text-white enabled:hover:bg-blue-800 data-[busy=true]:hover:bg-blue-800 active:bg-blue-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:border disabled:border-gray-200 disabled:border-solid',
				secondary:
					'bg-white text-gray-600 border-2 border-gray-500 enabled:hover:bg-gray-100 data-[busy=true]:hover:bg-white disabled:bg-gray-100 disabled:text-gray-400 disabled:border disabled:border-gray-200 disabled:border-solid',
				destructive:
					'bg-error text-white hover:bg-red-800 data-[busy=true]:hover:bg-error disabled:bg-gray-100 disabled:text-gray-400 disabled:border disabled:border-gray-200 disabled:border-solid',
				ghost:
					'text-gray-500 enabled:hover:bg-gray-100 enabled:hover:text-gray-600 data-[busy=true]:hover:bg-transparent data-[busy=true]:hover:text-gray-500 disabled:opacity-70',
				action:
					'inline-flex text-brand enabled:hover:text-blue-800 !px-0 active:text-blue-800 !h-fit disabled:text-gray-400 focus-visible:ring-offset-4',
			},
			size: {
				sm: 'text-sm h-9 px-3',
				md: 'text-base h-10 px-4',
				lg: 'text-lg h-12 px-8',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	}
)

export default buttonVariants
