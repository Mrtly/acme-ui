import React from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './DropdownMenu'
import { IconButton } from '@/components/buttons/IconButton'
import { Checkbox } from '@/components/forms/inputs/Checkbox'

// ----- DataTableActionsMenu

export type OptionsType = {
	displayName: string | React.ReactNode
	action: () => void
}

export type DataTableActionsMenuProps = {
	options: OptionsType[]
}

const DataTableActionsMenu = ({ options }: DataTableActionsMenuProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<IconButton
					variant="ghost"
					size="sm"
					className="p-1 size-6"
					ariaLabel="More options"
					title="More options"
					iconName="MoreHorizontal"
				></IconButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{options &&
					options.map((option, index) => {
						return (
							<DropdownMenuItem
								key={index + (option.displayName?.toString() || '')}
								onClick={option.action}
							>
								{option.displayName}
							</DropdownMenuItem>
						)
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

// ----- DataTableCheckbox

export type DataTableCheckboxProps = {
	id: string
	label: string
	checked: boolean

	onChange: (v: boolean) => void
}

function DataTableCheckbox({ id, label, checked, onChange }: DataTableCheckboxProps) {
	return (
		<Checkbox
			small
			id={id}
			label=""
			value=""
			aria-label={label}
			checked={checked}
			onChange={(value) => onChange(!!value)}
			className="mt-1.5"
		/>
	)
}

// ----- DataTableActions exports

export { DataTableActionsMenu, DataTableCheckbox }
