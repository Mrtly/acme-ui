import React from 'react'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
} from '../../menus/DropdownMenu/DropdownMenu'
import { Button } from '@/components/buttons/Button'
import { Table } from '@tanstack/react-table'

export type DataTableViewOptionsProps<TData> = {
	table: Table<TData>
}

function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="secondary" iconName="Trello" className="ml-auto">
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{table
					.getAllColumns()
					.filter((column) => column.getCanHide())
					.map((column, index) => {
						return (
							<DropdownMenuCheckboxItem
								key={index + column.id}
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{column.id}
							</DropdownMenuCheckboxItem>
						)
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export { DataTableViewOptions }
