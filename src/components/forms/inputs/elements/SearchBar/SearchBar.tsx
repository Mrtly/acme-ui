'use client'
import React, { useState } from 'react'
import { Icon } from '@/theme/Icons'
import { TextInput } from '@/components/forms/inputs/TextInput'
import { cn } from '@/utils/cn'

export type SearchBarProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string

	onValueChange: (newValue: string) => void
	id?: string
	className?: string
	srOnlyLabel?: boolean
	showSearchIcon?: boolean
	small?: boolean
	placeholder?: string
	value?: string
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
	(
		{
			id,
			className,
			label = 'Search',
			srOnlyLabel,
			placeholder = '',
			showSearchIcon = true,
			small = false,
			value = '',
			onValueChange,
		},
		ref
	) => {
		const [searchValue, setSearchValue] = useState(value)

		function handleChange(newValue: string) {
			setSearchValue(newValue)
			onValueChange(newValue)
		}

		return (
			<div className={cn('relative', className)}>
				{showSearchIcon && (
					<Icon
						name="Search"
						size={small ? 'sm' : 'md'}
						className={cn(
							'absolute left-1.5 transition-colors duration-100',
							small ? 'bottom-[10px]' : 'bottom-2.5',
							searchValue ? 'text-gray-600' : 'text-gray-400'
						)}
					/>
				)}
				<TextInput
					type="search"
					ref={ref}
					id={id || 'search'}
					name="search"
					label={label}
					srOnlyLabel={srOnlyLabel}
					placeholder={placeholder}
					autoComplete="off"
					value={searchValue}
					small={small}
					required={false} //set to false for the SearchBar
					showOptional={false} //set to false for the SearchBar
					className={cn(showSearchIcon && small && 'pl-7', showSearchIcon && !small && 'pl-8')}
					onChange={(e) => handleChange(e.target.value)}
				/>
				{searchValue && (
					<button
						aria-label="clear search"
						onClick={() => handleChange('')}
						className={cn(
							'p-1 text-gray-600 hover:bg-gray-100 bg-white rounded absolute right-2',
							small ? 'bottom-1.5' : 'bottom-2'
						)}
					>
						<Icon name="X" />
					</button>
				)}
			</div>
		)
	}
)
SearchBar.displayName = 'SearchBar'

export { SearchBar }
