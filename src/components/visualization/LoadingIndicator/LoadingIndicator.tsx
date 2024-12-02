import React from 'react'
import { cn } from '@/utils/cn'

export type LoadingIndicatorProps = {
	variant?: 'default' | 'dots'
	dotColor?: 'brand' | 'black' | 'gray'
	className?: string
}

const LoadingIndicator = ({
	variant = 'default',
	dotColor = 'brand',
	className,
}: LoadingIndicatorProps) => {
	//TW linter does not recognize the dynamic class
	//eslint-disable-next-line tailwindcss/no-custom-classname
	const dotStyle = cn(
		'size-2.5 rounded-full animate-pulse motion-reduce:animate-none',
		dotColor === 'gray' ? 'bg-gray-500' : `bg-${dotColor}`
	)

	return (
		<>
			{variant === 'default' && (
				<div
					className={cn(
						'animate-spin-slow motion-reduce:animate-none size-6 rounded-full',
						'border-[3px] border-current border-r-transparent motion-reduce:border-r-gray-300',
						className
					)}
					role="img"
					title="loading"
					aria-label="Loading indicator"
					data-testid="spinning-loader"
				/>
			)}
			{variant === 'dots' && (
				<div
					className={cn('flex items-center gap-1', className)}
					role="img"
					title="loading"
					aria-label="Loading indicator"
					data-testid="dots-loader"
				>
					<div className={cn(dotStyle)} data-testid="dot" />
					<div className={cn(dotStyle, 'delay-500')} />
					<div className={cn(dotStyle, 'delay-1000')} />
				</div>
			)}
		</>
	)
}

export { LoadingIndicator }
