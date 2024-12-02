'use client'
import React from 'react'
import { Switch as RACSwitch, SwitchProps as RACSwitchProps } from 'react-aria-components'
import { cn } from '@/utils/cn'

//https://react-spectrum.adobe.com/react-aria/Switch.html

// ------------------------------------- Switch

export type SwitchCardProps = RACSwitchProps & {
	id: string
	label: string
	children?: string | React.ReactNode
	statusLabelTrue?: string
	statusLabelFalse?: string
	error?: boolean
	disabled?: boolean
	readOnly?: boolean
	selected?: boolean
	defaultSelected?: boolean
	required?: boolean
	showOptional?: boolean
	srOnlyDescription?: boolean
}

const SwitchCard = React.forwardRef<HTMLLabelElement, SwitchCardProps>(
	(
		{
			id,
			label,
			statusLabelTrue,
			statusLabelFalse,
			children,
			className,
			error,
			disabled,
			readOnly,
			selected,
			defaultSelected,
			srOnlyDescription,
			...props
		},
		ref
	) => {
		//root & thumb styles are the same as Switch for now but may change in the future
		const rootStyles = cn(
			'h-[26px] w-[48px] inline-flex items-center shrink-0 rounded-full border border-transparent',
			'bg-gray-400 group-selected:bg-brand transition-colors duration-200 ease-in-out',
			'cursor-pointer group-disabled:cursor-not-allowed',
			'groupFocusVisibleRingStyles',
			error && 'ring-1 ring-error ring-offset-1',
			(readOnly || disabled) && 'group-selected:bg-brand/70 cursor-default bg-gray-200'
		)
		const thumbStyles = cn(
			'size-5 rounded-full bg-white translate-x-0.5',
			'transition-all duration-200 ease-in-out group-selected:translate-x-6',
			(readOnly || disabled) && 'bg-gray-400 group-selected:bg-white'
		)
		return (
			<div
				className={cn(
					'rounded-lg border bg-white p-6 w-full flex flex-col gap-3 min-w-fit',
					className
				)}
			>
				<RACSwitch
					id={id}
					ref={ref}
					isDisabled={disabled}
					isReadOnly={readOnly}
					isSelected={selected}
					defaultSelected={defaultSelected}
					aria-describedby={`${label}-description`}
					aria-labelledby="switch-label"
					{...props}
					className={cn(
						'group flex justify-between gap-2',
						statusLabelTrue || statusLabelFalse ? 'items-start' : 'items-center'
					)}
				>
					<div id="switch-label" className={cn('labelStyles text-base', disabled && 'opacity-70')}>
						{label}
						{readOnly && <span className="sr-only">read-only</span>}
						<div className="text-sm font-normal mt-2" data-testid="switchcard-status">
							{statusLabelTrue && (
								<div className="hidden group-selected:block ">{statusLabelTrue}</div>
							)}
							{statusLabelFalse && (
								<div className="block group-selected:hidden">{statusLabelFalse}</div>
							)}
						</div>
					</div>

					<div className={rootStyles}>
						<span className={thumbStyles} />
					</div>
				</RACSwitch>

				{/* slot for the description */}
				{children && (
					<div
						id={`${label}-description`}
						className={cn(
							'text-gray-500',
							srOnlyDescription && 'sr-only',
							disabled && 'opacity-70'
						)}
					>
						{children}
					</div>
				)}
			</div>
		)
	}
)
SwitchCard.displayName = 'SwitchCard'

// ------------------------------------- Switch export

export { SwitchCard }
