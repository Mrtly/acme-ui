import React from 'react'
import { cn } from '@/utils/cn'
import { cva } from 'class-variance-authority'
import { Icon } from '@/theme/Icons'

// ------------------------------------- Timeline

export type TimelineProps = {
	className?: string
	children: React.ReactNode
}

const Timeline = ({ className, children }: TimelineProps) => {
	const timelineStyles = cn('flex flex-col gap-8 border-s border-gray-400', className)
	return (
		<div className="p-2 pl-5">
			<ol className={timelineStyles}>{children}</ol>{' '}
		</div>
	)
}

// ------------------------------------- Timeline Item

export type TimelineItemProps = {
	children: React.ReactNode
}

const TimelineItem = ({ children }: TimelineItemProps) => {
	return <li className="ms-8 relative">{children}</li>
}

// ------------------------------------- Timeline Indicator

const timelineIndicatorVariants = cva('', {
	variants: {
		variant: {
			default: 'bg-gray-800',
			info: 'bg-brand',
			success: 'bg-success ',
			warning: 'bg-warning',
			error: 'bg-error ',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type TimelineIndicatorProps = {
	variant?: 'default' | 'info' | 'success' | 'warning' | 'error' | undefined
	icon?: React.ReactNode
	indicatorClass?: string
	imgSrc?: string
}

const TimelineIndicator = ({
	variant = 'default',
	icon,
	indicatorClass,
	imgSrc,
}: TimelineIndicatorProps) => {
	const variantIconName =
		variant === 'default'
			? 'Info'
			: variant === 'success'
				? 'Check'
				: variant === 'info'
					? 'Info'
					: variant === 'warning'
						? 'AlertTriangle'
						: variant === 'error'
							? 'AlertOctagon'
							: 'Info'

	const indicatorStyles = cn(
		'absolute -top-2 left-[-52px] flex items-center justify-center size-10 bg-black rounded-full',
		timelineIndicatorVariants({ variant }),
		indicatorClass
	)
	return (
		<div className={indicatorStyles}>
			{!imgSrc && icon && React.cloneElement(icon as React.ReactElement, { size: 'md' })}
			{!imgSrc && !icon && (
				<Icon
					name={variantIconName}
					aria-hidden="true"
					className="size-5 shrink-0 text-white"
					data-testid={`icon-${variant}`}
				/>
			)}
			{imgSrc && (
				<img src={imgSrc} aria-hidden="true" alt="" className="size-10 rounded-full object-cover" />
			)}
		</div>
	)
}

// ------------------------------------- Timeline Heading

export type TimelineHeadingProps = {
	className?: string
	children: React.ReactNode
}

const TimelineHeading = ({ className, children }: TimelineHeadingProps) => {
	const headingStyles = cn('text-lg font-semibold text-gray-800 flex gap-4', className)
	return <h3 className={headingStyles}>{children}</h3>
}

// ------------------------------------- Timeline Subheading

// should this include the DateFormat component?

export type TimelineSubheadingProps = {
	className?: string
	children: React.ReactNode
}

const TimelineSubheading = ({ className, children }: TimelineSubheadingProps) => {
	const subheadingStyles = cn('text-sm text-gray-500 ', className)
	return <span className={subheadingStyles}>{children}</span>
}

// ------------------------------------- Timeline Content

export type TimelineContentProps = {
	className?: string
	children: React.ReactNode
}

const TimelineContent = ({ className, children }: TimelineContentProps) => {
	const contentStyles = cn('text-gray-600 mt-1', className)
	return <p className={contentStyles}>{children}</p>
}

// ------------------------------------- Timeline exports

export {
	Timeline,
	TimelineItem,
	TimelineIndicator,
	TimelineHeading,
	TimelineContent,
	TimelineSubheading,
}
