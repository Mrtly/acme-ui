'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/theme/Icons'

// ------------------------------------- SideNavMenu

export type SideNavMenuProps = {
	children: React.ReactNode
	ariaLabel?: string // default is 'Main navigation',
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

type SideNavMenuHeadingProps = {
	id: string
	children: React.ReactNode
	srOnly?: boolean
}

const SideNavMenuHeading = ({ id, children, srOnly }: SideNavMenuHeadingProps) => {
	return (
		<h3
			id={id}
			className={cn(
				'px-4 py-2 text-sm text-gray-500 tracking-wider uppercase',
				srOnly && 'sr-only'
			)}
		>
			{children}
		</h3>
	)
}

// ------------------------------------- SideNavMenuSection

type SideNavMenuSectionProps = {
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
		<div className={cn('flex flex-col gap-2 mx-2 text-gray-500', className)}>
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

const CurrentChildContext = React.createContext<
	[
		{ href: string; current: boolean }[],
		React.Dispatch<React.SetStateAction<{ href: string; current: boolean }[]>>,
	]
>([null!, () => null!])

const SideNavMenuGroup = React.forwardRef<HTMLButtonElement, SideNavMenuGroupProps>(
	({ title, icon, children, className, ...props }, ref) => {
		const [expanded, setExpanded] = useState(false)
		const [childrenData, setChildrenData] = useState<{ href: string; current: boolean }[]>([])

		const triggerStyles = cn(
			'cursor-pointer flex items-center justify-between py-2 pl-4 pr-2 rounded-sm w-full',
			'focusVisibleRingStyles',
			className
		)
		const chevronStyles = cn('text-gray-600 transition-all duration-200', expanded && '-rotate-180')

		const hasCurrentChildStyle = '' // TODO: decide what style this will be

		const hasCurrentChild = childrenData.some((c) => c.current === true)

		const contentStyles = cn('pl-5 mt-1', expanded ? 'visible h-full' : 'invisible h-0')
		//^ use CSS to show/hide the content so the parent knows its children's width, current etc.

		useEffect(() => {
			//when landing on page, expand the group of current link
			hasCurrentChild && setExpanded(true)
		}, [hasCurrentChild])

		return (
			<CurrentChildContext.Provider value={[childrenData, setChildrenData]}>
				<li>
					<button
						tabIndex={0}
						ref={ref}
						aria-haspopup="menu"
						aria-expanded={expanded}
						className={cn(triggerStyles, hasCurrentChild && hasCurrentChildStyle)}
						{...props}
						onClick={() => setExpanded(!expanded)}
					>
						<div className="flex items-center gap-1">
							{/* {ItemIcon && <ItemIcon className="size-5 shrink-0 mr-1" />} */}
							{icon &&
								React.cloneElement(icon as React.ReactElement, {
									size: 'md',
									className: 'mr-1',
								})}
							{title}
						</div>
						<Icon name="ChevronDown" size="md" className={chevronStyles} />
					</button>
					<ul className={contentStyles}>{children}</ul>
				</li>
			</CurrentChildContext.Provider>
		)
	}
)
SideNavMenuGroup.displayName = 'SideNavMenuGroup'

// ------------------------------------- reused by SideNavMenuLink & SideNavMenuButton

const itemStyles =
	'w-full text-gray-500 hover:text-black flex items-center gap-2 py-2 px-4 rounded-sm focusVisibleRingStyles'

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

// ------------------------------------- SideNavMenuLink

export type SideNavMenuLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string
	children: string
	icon?: React.ReactNode
	className?: string
	current?: boolean
}

const SideNavMenuLink = React.forwardRef<HTMLAnchorElement, SideNavMenuLinkProps>(
	({ icon, children, href, className, current, ...props }, ref) => {
		const listItemRef = useRef<HTMLLIElement>(null) //refers to <li> wrapper (not the link within it (ref))
		useEffect(() => {
			checkIsParentUl(listItemRef)
		}, [])

		const linkStyles = cn(
			itemStyles,
			current && 'text-brand font-medium hover:text-brand', // TODO: decide what style this will be
			className
		)
		const [childrenData, setChildrenData] = useContext(CurrentChildContext)

		// childrenData results in duplicate objects because of double rendering (react) - can this be improved? not breaking
		useEffect(() => {
			const child = childrenData?.find((i) => i.href === href)
			setChildrenData((prevItems) => {
				const updatedItems = [...prevItems]
				if (child)
					updatedItems.map((c) => {
						if (c.href === href) {
							c.current = !!current
						}
					})
				else {
					const newChild = Object.assign({ href: href }, { current: !!current })
					updatedItems.push(newChild)
				}
				return updatedItems
			})
		}, [current, href]) // do not add the context to this, it results in infinite rerendering

		return (
			<li className="w-full" ref={listItemRef}>
				<a
					ref={ref}
					href={href}
					aria-current={current ? 'page' : undefined}
					className={linkStyles}
					{...props}
				>
					{icon && React.cloneElement(icon as React.ReactElement, { size: 'md' })}
					{children}
				</a>
			</li>
		)
	}
)
SideNavMenuLink.displayName = 'SideNavMenuLink'

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

		const btnStyles = cn(itemStyles, className)

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

type SideNavMenuDetailsSectionProps = {
	title: string
	children: React.ReactNode
}
const SideNavMenuDetailsSection = ({ title, children }: SideNavMenuDetailsSectionProps) => {
	const [childrenData, setChildrenData] = useState<{ href: string; current: boolean }[]>([])
	const hasCurrentChild = childrenData.some((c) => c.current === true)

	const defaultOpen = hasCurrentChild
	//eslint-disable-next-line
	const [expanded, setExpanded] = useState(defaultOpen || false)
	//Because defaultOpen does not change it does not cause a DOM update,
	//so the HTML control is still in charge of its state.

	useEffect(() => {
		const style = document.createElement('style')
		style.textContent = 'summary::-webkit-details-marker { display: none; }'
		document.head.appendChild(style)

		return () => {
			document.head.removeChild(style)
		}
	}, [])

	return (
		<CurrentChildContext.Provider value={[childrenData, setChildrenData]}>
			<details
				className="group"
				open={defaultOpen}
				onToggle={(e) => setExpanded((e.currentTarget as HTMLDetailsElement).open)}
			>
				<summary
					className={cn(
						'font-semibold text-gray-500 list-none flex items-center gap-1 cursor-pointer rounded',
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
				<div className="py-4 flex flex-col gap-6">{children}</div>
			</details>
		</CurrentChildContext.Provider>
	)
}

// ------------------------------------- SideNavMenu exports

export {
	SideNavMenu,
	SideNavMenuSection,
	SideNavMenuGroup,
	SideNavMenuLink,
	SideNavMenuButton,
	SideNavMenuDetailsSection,
}
