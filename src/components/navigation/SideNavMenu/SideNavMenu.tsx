'use client'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/theme/Icons'

// ------------------------------------- SideNavMenu

export type SideNavMenuProps = {
	children: React.ReactNode
	/**
	 * default ariaLabel is 'Main navigation'
	 */
	ariaLabel?: string
	className?: string
}

const SideNavMenu = ({
	children,
	ariaLabel = 'Main navigation',
	className,
	...props
}: SideNavMenuProps) => {
	const navStyles = cn('p-1 flex flex-col gap-6', className)
	return (
		<nav aria-label={ariaLabel} className={navStyles} {...props}>
			{children}
		</nav>
	)
}
SideNavMenu.displayName = 'SideNavMenu'

// ------------------------------------- SideNavMenuHeading

export type SideNavMenuHeadingProps = {
	children: React.ReactNode
	id: string
	srOnly?: boolean
}

const SideNavMenuHeading = ({ id, children, srOnly }: SideNavMenuHeadingProps) => {
	return (
		<h3
			id={id}
			className={cn(
				'px-4 py-2 text-sm text-gray-600 tracking-wider uppercase',
				srOnly && 'sr-only'
			)}
		>
			{children}
		</h3>
	)
}

// ------------------------------------- SideNavMenuSection

export type SideNavMenuSectionProps = {
	id: string
	heading?: string
	srOnlyHeading?: boolean
	children: React.ReactNode
	className?: string
}

const SideNavMenuSection = ({
	id,
	heading,
	srOnlyHeading,
	children,
	className,
}: SideNavMenuSectionProps) => {
	return (
		<div className={cn('flex flex-col gap-2 mx-2 text-gray-600', className)}>
			<SideNavMenuHeading srOnly={srOnlyHeading} id={id}>
				{heading}
			</SideNavMenuHeading>
			<ul aria-labelledby={id} className="flex flex-col gap-1 w-full">
				{children}
			</ul>
		</div>
	)
}

// ------------------------------------- SideNavMenuGroup

export type SideNavMenuGroupProps = {
	title: React.ReactNode | string
	icon?: React.ReactNode
	className?: string
	children: React.ReactNode
}

const SideNavMenuGroup = React.forwardRef<HTMLButtonElement, SideNavMenuGroupProps>(
	({ title, icon, children, className, ...props }, ref) => {
		const [expanded, setExpanded] = useState(false)

		const groupListParentRef = useRef<HTMLUListElement>(null)

		let hasCurrentChild: boolean | null = null

		const contentStyles = cn('pl-5 mt-1', expanded ? 'visible h-full' : 'invisible h-0')
		//^ use CSS to show/hide the content so the parent knows its children's width, current etc.

		useEffect(() => {
			//when landing on page, expand the group of current link
			if (groupListParentRef.current) {
				const liElementsArr = Array.from(groupListParentRef.current?.querySelectorAll('li'))

				hasCurrentChild = liElementsArr?.some((li) => li.getAttribute('data-current') === 'true')
			}
			if (hasCurrentChild) {
				setExpanded(true)
			}
		}, [])

		const triggerStyles = cn(
			'cursor-pointer flex items-center justify-between py-2 pl-4 pr-2 rounded-sm w-full',
			'focusVisibleRingStyles',
			hasCurrentChild && '', // TODO decide what style this will be
			className
		)
		const chevronStyles = cn('text-gray-600 transition-all duration-200', expanded && '-rotate-180')

		return (
			<li>
				<button
					tabIndex={0}
					ref={ref}
					aria-haspopup="menu"
					aria-expanded={expanded}
					className={cn(triggerStyles)}
					{...props}
					onClick={() => setExpanded(!expanded)}
				>
					<div className="flex items-center gap-1">
						{icon &&
							React.cloneElement(icon as React.ReactElement, {
								size: 'md',
								className: 'mr-1',
							})}
						{title}
					</div>
					<Icon name="ChevronDown" size="md" className={chevronStyles} />
				</button>
				<ul ref={groupListParentRef} className={contentStyles}>
					{children}
				</ul>
			</li>
		)
	}
)
SideNavMenuGroup.displayName = 'SideNavMenuGroup'

// ------------------------------------- reused by SideNavMenuListItem & SideNavMenuButton

const checkIsParentUl = (itemRef: React.RefObject<HTMLLIElement> | null) => {
	//confirm this <li> is contained in a <ul> - else console yell at developer
	const parentElement = itemRef?.current?.parentNode as Element
	if (parentElement?.tagName.toLowerCase() !== 'ul') {
		console.warn(
			itemRef?.current?.outerText,
			'element must be contained by a SideNavMenuSection or SideNavMenuGroup'
		)
	}
}

// ------------------------------------- SideNavMenuListItem

export type SideNavMenuListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
	children: React.ReactNode
	className?: string
	/**
	 * handles styling & adds aria-current="page" to the anchor child
	 */
	isCurrent?: boolean
}

const SideNavMenuListItem = ({
	children,
	isCurrent,
	className,
	...props
}: SideNavMenuListItemProps) => {
	const listItemRef = useRef<HTMLLIElement>(null)
	useEffect(() => {
		checkIsParentUl(listItemRef)
	}, [])

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
		<li
			ref={listItemRef}
			data-current={isCurrent ?? null} //used by parent to determine group expansion
			className={cn(
				'w-full text-gray-600 flex items-center gap-2 py-2 px-4 rounded-sm',
				'transition-colors duration-200',
				isCurrent ? 'text-brand' : 'hover:text-black',
				'[&>a]:outline-none', //remove native outline from <a> child
				isCurrent && '[&>a]:text-brand [&>a]:font-medium [&>a]:hover:text-brand',
				// focus-visible ring on parent of interactive child (<a>)
				'[&:has(:focus-visible)]:border-brand [&:has(:focus-visible)]:ring-2 [&:has(:focus-visible)]:ring-offset-2 ring-brand',
				className
			)}
			{...props}
		>
			{children}
		</li>
	)
}

// ------------------------------------- SideNavMenuButton

export type SideNavMenuButtonProps = {
	className?: string
	children: string
	icon?: React.ReactNode
	onClick: () => void
}

const SideNavMenuButton = React.forwardRef<HTMLButtonElement, SideNavMenuButtonProps>(
	({ icon, children, className, onClick, ...props }, ref) => {
		const listItemRef = useRef<HTMLLIElement>(null) //refers to <li> wrapper (not the button within it (ref))
		useEffect(() => {
			checkIsParentUl(listItemRef)
		}, [])

		const btnStyles = cn(
			'w-full flex items-center gap-2 py-2 px-4 rounded-sm text-gray-600',
			'transition-colors duration-200',
			'focusVisibleRingStyles hover:text-black active:text-black focus:text-black',
			className
		)

		return (
			<li className="w-full" ref={listItemRef}>
				<button ref={ref} className={btnStyles} onClick={onClick} {...props}>
					{icon && React.cloneElement(icon as React.ReactElement, { size: 'md' })}
					{children}
				</button>
			</li>
		)
	}
)
SideNavMenuButton.displayName = 'SideNavMenuButton'

// ------------------------------------- SideNavMenuDetailsSection

export type SideNavMenuDetailsSectionProps = {
	title: string
	children: React.ReactNode
}

const SideNavMenuDetailsSection = ({ title, children }: SideNavMenuDetailsSectionProps) => {
	const groupListParentRef = useRef<HTMLDivElement>(null)
	const [expanded, setExpanded] = useState(false)

	useEffect(() => {
		// when landing on page, expand the group if any child has data-current="true"
		if (groupListParentRef.current) {
			const liElementsArr = Array.from(groupListParentRef.current.querySelectorAll('li'))

			const hasCurrentChild = liElementsArr.some((li) => li.getAttribute('data-current') === 'true')

			if (hasCurrentChild) {
				setExpanded(true)
			}
		}
	}, [])

	// add custom style for details marker on safari
	useEffect(() => {
		const style = document.createElement('style')
		style.textContent = 'summary::-webkit-details-marker { display: none; }'
		document.head.appendChild(style)

		return () => {
			document.head.removeChild(style)
		}
	}, [])

	return (
		<details
			className="group"
			open={expanded}
			onToggle={(e) => setExpanded((e.currentTarget as HTMLDetailsElement).open)} // sync with native onToggle event
		>
			<summary
				className={cn(
					'font-semibold text-gray-600 list-none flex items-center gap-1 cursor-pointer rounded',
					'py-2 focusVisibleRingStyles'
				)}
			>
				<Icon
					name="ChevronRight"
					size="md"
					className="group-open:rotate-90 transition-transform duration-100"
				/>
				{title}
			</summary>
			<div ref={groupListParentRef} className="py-4 flex flex-col gap-6">
				{children}
			</div>
		</details>
	)
}

// ------------------------------------- SideNavMenu exports

export {
	SideNavMenu,
	SideNavMenuSection,
	SideNavMenuGroup,
	SideNavMenuListItem,
	SideNavMenuButton,
	SideNavMenuDetailsSection,
}
