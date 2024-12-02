import React from 'react'
import { cn } from '@/utils/cn'
import { linkVariants } from './linkVariants'
import { Icon, type IconProps } from '@/theme/Icons'

export type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string
	/** wil add an external icon and overwrite iconName */
	isExternal?: boolean
	className?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	variant?: 'inline' | 'action'
	iconName?: IconProps['name'] | null //null so the default icon can be removed
	iconPosition?: 'left' | 'right'
	isFullWidth?: boolean
}
const Link = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
	(
		{
			href,
			className,
			iconPosition = 'right',
			isFullWidth,
			iconName,
			children,
			isExternal,
			variant = 'action',
			size = 'md',
			...props
		},
		ref
	) => {
		if (variant === 'action' && !iconName && iconName !== null) {
			iconName = 'ChevronRight'
		}
		const styles = cn(
			linkVariants({ variant, size }),
			isFullWidth ? 'w-full justify-between' : '',
			className
		)

		const target = isExternal ? { target: '_blank' } : null

		return (
			<a ref={ref} href={href} className={styles} {...target} {...props}>
				{iconName && !isExternal && iconPosition === 'left' && (
					<Icon
						name={iconName}
						size={size}
						data-testid={`${iconName}-icon-${iconPosition}`}
						className="inline align-middle"
					/>
				)}
				{children}
				{iconName && !isExternal && iconPosition === 'right' && (
					<Icon
						name={iconName}
						size={size}
						data-testid={`${iconName}-icon-${iconPosition}`}
						className="inline align-middle"
					/>
				)}
				{isExternal && (
					<Icon
						name="ExternalLink"
						size={size}
						data-testid="external-icon"
						className="inline align-middle"
					/>
				)}
			</a>
		)
	}
)
Link.displayName = 'Link'

export { Link }
