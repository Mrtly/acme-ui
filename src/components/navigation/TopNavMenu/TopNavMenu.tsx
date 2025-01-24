'use client'
import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/theme/Icons'
import { useOutsideClick } from '../../../hooks/useOutsideClick'
import debounce from '@/utils/helpers/debounce'

type ItemIconProps = React.SVGAttributes<SVGElement> & {
	className?: string
}

// ------------------------------------- TopNavMenu

export type TopNavMenuProps = {
	children: React.ReactNode
	/**
	 * default ariaLabel is 'Top Navigation'
	 */
	ariaLabel?: string
	className?: string
}

const TopNavMenu = ({
	children,
	ariaLabel = 'Top Navigation',
	className,
	...props
}: TopNavMenuProps) => {
	const navStyles = cn('flex w-full', className)
	return (
		<nav aria-label={ariaLabel} className={navStyles} {...props}>
			<ul className="flex items-center rounded gap-1 w-fit">{children}</ul>
		</nav>
	)
}

// ------------------------------------- TopNavMenuGroup

export type TopNavMenuGroupProps = {
	title: React.ReactNode | string
	className?: string
	children: React.ReactNode
	hasCurrentChildItem?: boolean
}

const TopNavMenuGroup = React.forwardRef<HTMLButtonElement, TopNavMenuGroupProps>(
	({ title, children, className, hasCurrentChildItem, ...props }, ref) => {
		const [expanded, setExpanded] = useState(false)

		const listItemStyles = cn('relative group')
		//styles currently unused. add back to listItemStyles for bottom border visual effect
		// 'group relative hover:after:bg-brand after:transition-colors after:delay-75 after:duration-200',
		// current && 'after:bg-brand font-medium',
		// 'after:h-1 after:w-[calc(100%-16px)] after:absolute after:-bottom-[2px] after:right-2'

		const triggerStyles = cn(
			'flex items-center gap-1 rounded p-2 outline-none ease-in',
			'cursor-default focusVisibleRingStyles transition-colors duration-200',
			hasCurrentChildItem ? 'font-medium text-brand' : 'font-medium text-gray-500 hover:text-black',
			className
		)
		const chevronStyles = cn(
			'text-gray-600 transition-all delay-75 duration-200',
			expanded && '-rotate-180'
		)

		//eslint-disable-next-line tailwindcss/no-custom-classname
		const contentStyles = cn(
			'absolute z-10 top-11 border rounded w-fit p-1 bg-white',
			'transition-all duration-200',
			// the ::before covers the gap between trigger & content - h must be increased if gap increases
			expanded
				? "flex flex-col gap-1 after:content=[''] after:h-2 after:w-[calc(100%-16px)] after:absolute after:-top-2 after:left-0"
				: 'hidden'
		)

		const openContent = () => {
			if (!expanded) {
				debounce(() => setExpanded(true), 100)()
			}
		}

		const closeContent = () => {
			if (expanded) {
				debounce(() => setExpanded(false), 100)()
			}
		}

		const contentRef = useRef<HTMLUListElement>(null)
		useOutsideClick(contentRef, closeContent)

		return (
			<li
				className={listItemStyles}
				onMouseOver={openContent}
				onMouseLeave={closeContent}
				data-content //used to keep links in font-normal within the group
			>
				<button
					ref={ref}
					aria-haspopup="menu"
					aria-expanded={expanded}
					className={cn(triggerStyles)}
					onClick={openContent}
					data-state={expanded ? 'open' : 'closed'}
					{...props}
				>
					{title}
					<Icon name="ChevronDown" size="sm" className={chevronStyles} data-testid="chevron" />
				</button>

				<ul ref={contentRef} className={contentStyles} onClick={closeContent}>
					{children}
				</ul>
			</li>
		)
	}
)
TopNavMenuGroup.displayName = 'TopNavMenuGroup'

// ------------------------------------- TopNavMenuListItem

export type TopNavMenuListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
	children: string | React.ReactNode
	className?: string
	/**
	 * handles styling
	 */
	isCurrent?: boolean
}

const TopNavMenuListItem = ({
	children,
	className,
	isCurrent,
	...props
}: TopNavMenuListItemProps) => {
	//listItemStyles currently unused. add to <li> for bottom border visual effect
	// const listItemStyles = cn(
	// 		'w-full relative',
	// 		'group-data-[content]:after:bg-transparent', //after will not show if link is a group's child
	// 		'hover:after:bg-brand after:transition-colors after:delay-75 after:duration-200',
	// 		current && 'after:bg-brand',
	// 		'after:h-1 after:w-[calc(100%-16px)] after:absolute after:-bottom-[2px] after:right-2'
	// 	)
	const listItemRef = useRef<HTMLLIElement>(null)

	const listItemStyles = cn(
		'w-full flex items-center gap-2 p-2 rounded whitespace-nowrap',
		'transition-colors duration-200',
		isCurrent ? 'text-brand' : 'text-gray-500 hover:text-black',
		// font is medium when outside of a group, but normal when within a group content
		'font-medium group-data-[content]:font-normal group-data-[content]:hover:bg-gray-100',
		'[&>a]:outline-none', //remove native outline from <a> child
		// // focus-visible ring on parent of interactive child (<a>)
		'[&:has(:focus-visible)]:border-brand [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-offset-2 ring-brand',
		className
	)

	useEffect(() => {
		if (listItemRef.current) {
			const anchor = listItemRef.current?.querySelector('a')
			if (isCurrent) {
				anchor?.setAttribute('aria-current', 'page')
			} else {
				anchor?.removeAttribute('aria-current')
			}
		}
	}, [isCurrent])
	// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current

	return (
		<li ref={listItemRef} data-current={isCurrent} className={listItemStyles} {...props}>
			{children}
		</li>
	)
}

// ------------------------------------- TopNavMenuButton

export type TopNavMenuButtonProps = {
	className?: string
	children: React.ReactNode
	icon?: React.FC<ItemIconProps>
	onClick: () => void
}
const TopNavMenuButton = React.forwardRef<HTMLButtonElement, TopNavMenuButtonProps>(
	({ icon, children, className, onClick, ...props }, ref) => {
		//listItemStyles currently unused. add to <li> for bottom border visual effect
		// const listItemStyles = cn(
		// 	'w-full relative',
		// 	'group-data-[content]:after:bg-transparent', //after will not show if link is a group's child
		// 	'hover:after:bg-brand after:transition-colors after:delay-75 after:duration-200',
		// 	'after:h-1 after:w-[calc(100%-16px)] after:absolute after:-bottom-[2px] after:right-2'
		// )

		const linkStyles = cn(
			'w-full flex items-center gap-2 p-2 rounded whitespace-nowrap',
			'focusVisibleRingStyles transition-colors duration-200',
			// font is medium when outside of a group, but normal when within a group content
			'text-gray-500 hover:text-black',
			'font-medium group-data-[content]:font-normal group-data-[content]:hover:bg-gray-100',
			className
		)

		const Icon = icon || null
		return (
			<li>
				<button ref={ref} className={linkStyles} onClick={onClick} {...props}>
					{Icon && <Icon className="size-5 shrink-0" />}
					{children}
				</button>
			</li>
		)
	}
)
TopNavMenuButton.displayName = 'TopNavMenuButton'

// ------------------------------------- TopNavMenu exports

export { TopNavMenu, TopNavMenuGroup, TopNavMenuListItem, TopNavMenuButton }
