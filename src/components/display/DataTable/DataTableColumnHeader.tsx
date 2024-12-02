import React from 'react'
import { Column } from '@tanstack/react-table'
import { IconButton } from '@/components/buttons/IconButton'
import { cn } from '@/utils/cn'

export type DataTableColumnHeaderProps<TData, TValue> = React.HTMLAttributes<HTMLDivElement> & {
	column: Column<TData, TValue>
	title: string
	enableSorting?: boolean
}

const DataTableColumnHeader = <TData, TValue>({
	column,
	title,
	enableSorting = false,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) => {
	return (
		<div className={cn('flex items-center gap-x-1', className)}>
			{title}
			{enableSorting && column.getCanSort() && (
				<IconButton
					variant="ghost"
					size="sm"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="h-7 p-1"
					iconName={column.getIsSorted() === 'asc' ? 'ArrowDown' : 'ArrowUp'}
					ariaLabel={column.getIsSorted() === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
					title={column.getIsSorted() === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
				></IconButton>
			)}
		</div>
	)
}

export { DataTableColumnHeader }
