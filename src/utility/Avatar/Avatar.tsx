import React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/utils/cn'
import { Icon } from '@/theme/Icons'

// Inspiration: https://ui.shadcn.com/docs/components/avatar
// TODO: need placeholder user icon for the lazy loading

// ------------------------------------- Avatar

const Avatar = ({ className, ...props }: AvatarPrimitive.AvatarProps) => {
	const styles = cn([
		'relative flex size-10 shrink-0 overflow-hidden rounded-full text-gray-500',
		className,
	])

	return <AvatarPrimitive.Root className={styles} {...props} />
}

// ------------------------------------- Avatar Image

const AvatarImage = ({ className, ...props }: AvatarPrimitive.AvatarImageProps) => {
	const styles = cn(['aspect-square size-full', className])

	return <AvatarPrimitive.Image className={styles} {...props} />
}

// ------------------------------------- Avatar Fallback

const AvatarFallback = ({ className, ...props }: AvatarPrimitive.AvatarFallbackProps) => {
	const styles = cn([
		'flex size-full items-center justify-center rounded-full bg-gray-100',
		className,
	])

	return (
		<AvatarPrimitive.Fallback className={styles} {...props}>
			{props.children || <Icon name="User" size="md" />}
		</AvatarPrimitive.Fallback>
	)
}

// ------------------------------------- Avatar Exports

export { Avatar, AvatarImage, AvatarFallback }
