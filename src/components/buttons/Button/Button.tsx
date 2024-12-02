import React from 'react'
import { cn } from '@/utils/cn'
import buttonVariants from '@/components/buttons/Button/buttonVariants'
import { Icon, type IconProps } from '@/theme/Icons'
import { LoadingIndicator } from '@/components/visualization/LoadingIndicator'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: string
	variant?: 'primary' | 'destructive' | 'secondary' | 'ghost' | 'action'
	size?: 'sm' | 'md' | 'lg'
	iconName?: IconProps['name'] | null
	iconPosition?: 'right' | 'left'
	busy?: boolean
	busyMsg?: string
	isFullWidth?: boolean
	type?: 'button' | 'submit' | 'reset' // default type="button"
}

//The type prop is destructured from the ...rest because a button placed inside a form is by default a submit button (submits form-data)
//this is often the cause of bugs/unintended form submission, so defaulting it to "button" is a good failsafe

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = 'primary',
			size = 'md',
			children,
			disabled,
			busy,
			busyMsg,
			iconName,
			iconPosition = 'right',
			isFullWidth,
			type = 'button',
			...props
		},
		ref
	) => {
		const styles = cn(
			buttonVariants({ variant, size }),
			'data-[busy=true]:enabled:cursor-default',
			isFullWidth ? 'w-full' : 'w-fit',
			className
		)
		return (
			<button
				type={type}
				className={styles}
				ref={ref}
				disabled={disabled}
				onClick={busy ? undefined : props.onClick}
				data-busy={busy}
				{...props}
			>
				{iconName && iconName !== null && iconPosition === 'left' && (
					<Icon name={iconName} size={size} data-testid={`${iconName}-icon-${iconPosition}`} />
				)}
				{busy && busyMsg && variant !== 'action' ? busyMsg : children}

				{busy && variant !== 'action' && !iconName && (
					<span data-testid="loading-indicator">
						<span className="sr-only">, busy</span>
						<LoadingIndicator aria-hidden="true" className="ml-2" />
					</span>
				)}

				{variant === 'action' && !iconName && iconName !== null && (
					<Icon name="ChevronRight" size={size} data-testid={`ChevronRight-icon`} />
				)}

				{iconName && iconName !== null && iconPosition === 'right' && (
					<Icon name={iconName} size={size} data-testid={`${iconName}-icon-${iconPosition}`} />
				)}
			</button>
		)
	}
)
Button.displayName = 'Button'

export { Button }
