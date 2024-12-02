'use client'
import React from 'react'
import { Switch as SwitchComponent } from 'react-aria-components'
import type { SwitchProps as SwitchComponentProps } from 'react-aria-components'
import { cn } from '@/utils/cn'

//https://react-spectrum.adobe.com/react-aria/Switch.html

// ------------------------------------- Switch

export type SwitchProps = SwitchComponentProps & {
	id: string
	label: string
	error?: boolean
	disabled?: boolean
	readOnly?: boolean
	selected?: boolean
	defaultSelected?: boolean
	required?: boolean
	showOptional?: boolean
}

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
	(
		{ id, label, className, error, disabled, readOnly, selected, defaultSelected, ...props },
		ref
	) => {
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
			<SwitchComponent
				id={id}
				isDisabled={disabled}
				isReadOnly={readOnly}
				{...props}
				className={cn('group my-1 flex w-fit gap-2 items-center', className)}
				ref={ref}
				isSelected={selected}
				defaultSelected={defaultSelected}
			>
				<div className={cn('labelStyles', disabled && 'opacity-70')}>
					{label}
					{readOnly && <span className="sr-only">read-only</span>}
				</div>
				<div className={rootStyles}>
					<span className={thumbStyles} />
				</div>
			</SwitchComponent>
		)
	}
)
Switch.displayName = 'Switch'

// ------------------------------------- Switch export

export { Switch }
