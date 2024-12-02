import React from 'react'
import { cn } from '@/utils/cn'
import * as featherIcons from 'react-feather'

// https://feathericons.com/

// Feather Icon wrappers with sizing

const getIconSize = (size: 'sm' | 'md' | 'lg' | 'xl') => {
	return size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : size === 'xl' ? 30 : 16 //defaults to sm
}

type FeatherIconName = keyof typeof featherIcons

type IconProps = React.SVGAttributes<SVGElement> & {
	name: FeatherIconName
	size?: 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	ariaLabel?: string
}

const Icon = ({ name, size = 'sm', className, ariaLabel = '', ...props }: IconProps) => {
	const IconComponent = featherIcons[name as FeatherIconName]

	if (IconComponent) {
		return (
			<IconComponent
				size={getIconSize(size)}
				role="img"
				focusable="false"
				aria-hidden={!ariaLabel}
				aria-label={ariaLabel}
				className={cn('shrink-0', className)}
				{...props}
			/>
		)
	}
	return null //fallback if Icon is not found
}

export { Icon, type FeatherIconName, type IconProps }

const featherIconNames: FeatherIconName[] = Object.keys(featherIcons) as FeatherIconName[]

export { featherIconNames }

// Icon Usage
// import { Icon } from '@acme-gds/ui'
/* <Icon name="AlertCircle" size="sm" /> */
/* <Icon name="AlertTriangle" size="md" /> */
