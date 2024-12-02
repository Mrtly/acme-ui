import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/forms/inputs/Select'
import { IconButton } from '@/components/buttons/IconButton'
import { Table } from '@tanstack/react-table'
import { cn } from '@/utils/cn'

export type DataTablePaginationProps<TData> = {
	table: Table<TData>
	showRowsPerPage?: boolean
	showRowsSelected?: boolean
	showPager?: boolean
	showGoToFirstLast?: boolean
	pageSizes?: number[]
	className?: string
}

function DataTablePagination<TData>({
	table,
	showRowsPerPage = true,
	showRowsSelected = true,
	showPager = true,
	showGoToFirstLast = true,
	pageSizes,
	className,
}: DataTablePaginationProps<TData>) {
	return (
		<div className={cn('flex items-center justify-between gap-2 py-2 text-sm', className)}>
			{showRowsSelected && (
				<div className="hidden md:flex">
					{table.getSelectedRowModel().rows.length} of{' '}
					{table.getPrePaginationRowModel().rows.length} rows selected
				</div>
			)}
			<div className="hidden md:flex items-center gap-1">
				<span className="">Rows per page</span>
				<Select
					name="pagesize"
					selectedKey={table.getState().pagination.pageSize.toString()}
					onSelectionChange={(v) => {
						table.setPageSize(Number(v))
					}}
					className="w-fit"
					data-testid="select-rows"
					label="show rows"
					srOnlyLabel
				>
					<SelectTrigger id="select" small />
					<SelectContent>
						{pageSizes &&
							showRowsPerPage &&
							pageSizes?.map((size, index) => {
								return (
									<SelectItem key={index + size.toString()} value={size.toString()}>
										{size.toString()}
									</SelectItem>
								)
							})}
					</SelectContent>
				</Select>
			</div>
			{showPager && (
				<div className="flex gap-2 items-center text-sm">
					<div>
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
					</div>
					{showGoToFirstLast && (
						<IconButton
							variant="secondary"
							size="xs"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
							ariaLabel="Go to first page"
							className="pl-1.5"
							iconName="ChevronsLeft"
						/>
					)}
					<IconButton
						variant="secondary"
						size="xs"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						ariaLabel="previous page"
						className="pl-1"
						iconName="ChevronLeft"
					/>
					<IconButton
						variant="secondary"
						size="xs"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						ariaLabel="next page"
						className="pr-1"
						iconName="ChevronRight"
					/>
					{showGoToFirstLast && (
						<IconButton
							variant="secondary"
							size="xs"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
							ariaLabel="Go to last page"
							className="pr-1.5"
							iconName="ChevronsRight"
						/>
					)}
				</div>
			)}
		</div>
	)
}

export { DataTablePagination }
