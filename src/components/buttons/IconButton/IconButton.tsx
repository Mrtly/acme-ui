import React from 'react'
import { cn } from '@/utils/cn'
import iconButtonVariants from './iconButtonVariants'
import { Icon, type IconProps } from '@/theme/Icons'
import { LoadingIndicator } from '@/components/visualization/LoadingIndicator'

// ------------------------------------- IconButton

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	ariaLabel: string
	busy?: boolean
	busyMsg?: string
	iconName: IconProps['name']
	size?: 'sm' | 'md' | 'lg' | 'xs'
	variant?: 'primary' | 'destructive' | 'secondary' | 'ghost'
	type?: 'button' | 'submit' | 'reset' // default type="button"
}

//The type prop is destructured from the ...rest because a button placed inside a form is by default a submit button (submits form-data)
//this is often the cause of bugs/unintended form submission, so defaulting it to "button" is a good failsafe

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			ariaLabel,
			className,
			variant = 'primary',
			size = 'md',
			disabled,
			busy,
			busyMsg,
			iconName,
			type = 'button',
			...props
		},
		ref
	) => {
		const styles = cn(
			iconButtonVariants({ variant, size }),
			'data-[busy=true]:enabled:cursor-default',
			className
		)
		return (
			<button
				type={type}
				ref={ref}
				aria-label={ariaLabel}
				disabled={disabled}
				className={styles}
				onClick={busy ? undefined : props.onClick}
				data-busy={busy}
				{...props}
			>
				{busy ? (
					<span data-testid="loading-indicator">
						<span className="sr-only">, busy, {busyMsg}</span>
						<LoadingIndicator aria-hidden="true" />
					</span>
				) : (
					<Icon name={iconName} size={size === 'xs' ? 'sm' : size} />
				)}
			</button>
		)
	}
)
IconButton.displayName = 'IconButton'

export { IconButton }
