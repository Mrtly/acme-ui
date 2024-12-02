import React from 'react'
import {
	Table as TableWrapper,
	TableCaption,
	TableHeader,
	TableHead,
	TableRow,
	TableBody,
	TableCell,
} from './Table'
import { cn } from '@/utils/cn'

import { Table, flexRender } from '@tanstack/react-table'

//  ----- DataTable

export type DataTableProps = {
	className?: string
	children: React.ReactNode
}

const DataTable = ({ className, children }: DataTableProps) => {
	return (
		<TableWrapper className={cn('border bg-white border-gray-300', className)}>
			{children}
		</TableWrapper>
	)
}

//  ----- DataTableCaption

export type DataTableCaptionProps = {
	className?: string
	children: React.ReactNode
}

const DataTableCaption = ({ className, children }: DataTableCaptionProps) => {
	return <TableCaption className={cn(className)}>{children}</TableCaption>
}

//  ----- DataTableHeader

export type DataTableHeaderProps<TData> = {
	table: Table<TData>
	className?: string
}

function DataTableHeader<TData>({ table, className }: DataTableHeaderProps<TData>) {
	return (
		<TableHeader data-testid="table-header">
			{table.getHeaderGroups().map((headerGroup, index) => (
				<TableRow key={index + headerGroup.id}>
					{headerGroup.headers.map((header, index) => {
						return (
							<TableHead
								key={index + header.id}
								className={cn('text-sm tracking-wide text-gray-500', className)}
							>
								{flexRender(header.column.columnDef.header, header.getContext())}
							</TableHead>
						)
					})}
				</TableRow>
			))}
		</TableHeader>
	)
}

//  ----- DataTableBody

export type DataTableBodyProps<TData> = {
	table: Table<TData>
	className?: string
}

function DataTableBody<TData>({ table, className = '' }: DataTableBodyProps<TData>) {
	return (
		<TableBody>
			{table.getRowModel().rows?.length ? (
				table.getRowModel().rows.map((row) => (
					<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
						{row.getVisibleCells().map((cell) => (
							<TableCell key={cell.id} className={className}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</TableCell>
						))}
					</TableRow>
				))
			) : (
				<TableRow>
					<TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
						No results.
					</TableCell>
				</TableRow>
			)}
		</TableBody>
	)
}

//  ----- DataTableRender exports

export { DataTable, DataTableCaption, DataTableHeader, DataTableBody }
