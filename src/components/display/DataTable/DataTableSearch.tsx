import React from 'react'
import { SearchBar } from '@/components/forms/inputs/elements/SearchBar'
import { Table } from '@tanstack/react-table'

// ---- DataTableGlobalSearch

export type DataTableGlobalSearchProps = {
	value: string

	onValueChange: (value: string) => void
	placeholder?: string
	showSearchIcon?: boolean
}

function DataTableGlobalSearch({
	value,
	onValueChange,
	placeholder,
	showSearchIcon = false,
}: DataTableGlobalSearchProps) {
	return (
		<SearchBar
			label="table search"
			srOnlyLabel
			showSearchIcon={showSearchIcon}
			small
			placeholder={placeholder || 'Search'}
			value={value}
			onValueChange={(value) => onValueChange(value)}
		/>
	)
}

// ---- DataTableColumnSearch

export type DataTableColumnSearchProps<TData> = {
	table: Table<TData>
	searchColumn: string
	placeholder?: string
}

function DataTableColumnSearch<TData>({
	table,
	searchColumn,
	placeholder,
}: DataTableColumnSearchProps<TData>) {
	const searchValue = (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''

	const handleOnValueChange = (value: string) => {
		table.getColumn(searchColumn)?.setFilterValue(value)
	}

	return (
		<SearchBar
			label="table search"
			srOnlyLabel
			showSearchIcon={false}
			small
			placeholder={placeholder || 'Search'}
			value={searchValue}
			onValueChange={(value) => handleOnValueChange(value)}
		/>
	)
}

// ----- DataTable Search exports

export { DataTableGlobalSearch, DataTableColumnSearch }
