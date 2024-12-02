import React from 'react'
import { cn } from '@/utils/cn'

// ------------------------------------- Label

export type LabelProps = React.HTMLAttributes<HTMLLabelElement> & {
	htmlFor: string
	srOnly?: boolean
}

// labelStyles is a custom class declared in Tailwind config
// and is shared by other input components that have custom labels

const Label = ({ htmlFor, srOnly, className, ...props }: LabelProps) => {
	const styles = cn('labelStyles', srOnly && 'sr-only', className)

	return <label htmlFor={htmlFor} className={styles} {...props} />
}

// ------------------------------------- Label Exports

export { Label }
