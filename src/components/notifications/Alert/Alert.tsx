import React from 'react'
import { Icon, type IconProps } from '@/theme/Icons'
import { Button } from '@/components/buttons/Button'
import { CustomLinkProps, Link } from 'src/utility/Link/Link'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'
import { useAlertService } from './alertService'

// ------------------------------------- Alert Variants

const alertVariants = cva('relative w-full rounded-lg border text-gray-500 flex overflow-hidden', {
	variants: {
		variant: {
			neutral: 'border-gray-700 bg-gray-700',
			success: 'border-success bg-success',
			info: 'border-blue-800 bg-blue-800',
			error: 'border-error bg-error',
			warning: 'border-warning bg-warning',
		},
	},
	defaultVariants: {
		variant: 'neutral',
	},
})

// ------------------------------------- Alert Variant Type

export type AlertVariants = 'neutral' | 'success' | 'info' | 'error' | 'warning'

// ------------------------------------- Alert

export type AlertProps = React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof alertVariants> & {
		children?: React.ReactNode
	}

const Alert = ({ children, className, variant, ...props }: AlertProps) => {
	const styles = cn([alertVariants({ variant }), className])

	return (
		<div role="alert" className={styles} {...props}>
			<AlertIcon variant={variant} />
			<div className="bg-white grow w-full p-4">{children}</div>
		</div>
	)
}

// ------------------------- Alert Icon

export type AlertAlertIconProps = VariantProps<typeof alertVariants> & {
	className?: string
}

const AlertIcon = ({ variant = 'neutral', className }: AlertAlertIconProps) => {
	const styles = cn(['flex justify-center items-center text-white text-xl px-2', className])

	return (
		<div className={styles} data-testid={`icon-${variant}`}>
			{(variant == 'neutral' || variant == 'info') && <Icon name="Info" size="xl" />}
			{variant == 'success' && <Icon name="Check" size="xl" />}
			{variant == 'error' && <Icon name="AlertOctagon" size="xl" />}
			{variant == 'warning' && <Icon name="AlertTriangle" size="xl" />}
		</div>
	)
}

// ------------------------------------- Alert Content

const AlertContent = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
	const styles = cn(['font-semibold text-base', className])

	return <div className={styles} {...props} />
}

// ------------------------------------- Alert Actions

export type AlertActionsProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode
	onDismiss: () => void
	isDismissible?: boolean
}

const AlertActions = ({
	children,
	onDismiss,
	isDismissible = true,
	className,
	...props
}: AlertActionsProps) => {
	const styles = cn(['w-full flex flex-wrap gap-6 justify-end items-center mt-4', className])

	return (
		<div className={styles} {...props}>
			{children}
			{isDismissible && <AlertDismissButton onClick={onDismiss} />}
		</div>
	)
}

// ------------------------------------- Alert Action Button

const AlertActionButton = ({
	className,
	onClick,
	children,
	iconName = 'ChevronRight',
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: string
	onClick: () => void
	iconName?: IconProps['name'] | null
}) => {
	return (
		<Button
			variant="action"
			size="md"
			iconName={iconName}
			onClick={onClick}
			className={cn(className, 'whitespace-nowrap')}
			{...props}
		>
			{children}
		</Button>
	)
}

// ------------------------------------- Alert Action Link

const AlertActionLink = ({
	className,
	href,
	children,
	iconName = 'ChevronRight',
	...props
}: Pick<
	CustomLinkProps,
	'href' | 'iconName' | 'children' | keyof React.AnchorHTMLAttributes<HTMLAnchorElement>
> & {}) => {
	return (
		<Link
			href={href}
			variant="action"
			size="md"
			iconName={iconName}
			className={cn(className, 'whitespace-nowrap')}
			{...props}
		>
			{children}
		</Link>
	)
}

// ------------------------------------- Alert Dismiss Button

const AlertDismissButton = ({
	onClick,
	...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
	onClick: () => void
}) => {
	return (
		<AlertActionButton className="flex items-center" onClick={onClick} iconName="X" {...props}>
			Dismiss
		</AlertActionButton>
	)
}

// ------------------------------------- Alert Area

const AlertArea = ({ maxVisibleAlerts = 3 }: { maxVisibleAlerts?: number }) => {
	const { alerts, dismissAlert } = useAlertService()

	const visibleAlerts = alerts.slice(0, maxVisibleAlerts)

	const styles = cn(
		'flex flex-col gap-2',
		//removes div from the dom so it does not cause flex gap issues when !visibleAlerts
		!visibleAlerts.length && 'hidden'
	)

	return (
		<div className={styles}>
			{visibleAlerts.map((alert) => (
				<Alert key={alert.id} variant={alert.variant}>
					<AlertContent>{alert.content}</AlertContent>
					<AlertActions
						isDismissible={alert.isDismissible}
						onDismiss={() => {
							if (alert.isDismissible) {
								if (alert.onDismissAction) {
									alert.onDismissAction()
								}
								dismissAlert(alert.id!)
							}
						}}
					>
						{alert.action && (
							<AlertActionButton onClick={alert.action.onClick}>
								{alert.action.label}
							</AlertActionButton>
						)}
						{alert.link && (
							<AlertActionLink href={alert.link.href}>{alert.link.label}</AlertActionLink>
						)}
					</AlertActions>
				</Alert>
			))}
		</div>
	)
}

// ------------------------------------- Alert Exports

export { Alert, AlertContent, AlertActions, AlertActionButton, AlertActionLink, AlertArea }
