import React from 'react'
import { Column } from '@tanstack/react-table'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from './Command'
import { Popover, PopoverContent, PopoverTrigger } from 'src/utility/Popover'
import { Badge } from '@/components/display/Badge'
import { Button } from '@/components/buttons/Button'
import { Separator } from '../../../utility/Separator'
import { Icon } from '@/theme/Icons'
import { Checkbox } from '@/components/forms/inputs/Checkbox'
import { Table } from '@tanstack/react-table'
import buttonVariants from '@/components/buttons/Button/buttonVariants'
import { cn } from '@/utils/cn'

// ----- DataTableFilter

export type DataTableFilterProps<TData, TValue> = {
	column?: Column<TData, TValue>
	title?: string
	options: string[]
}

const DataTableFilter = <TData, TValue>({
	column,
	title,
	options,
}: DataTableFilterProps<TData, TValue>) => {
	const facets = column?.getFacetedUniqueValues()
	const selectedValues = new Set(column?.getFilterValue() as string[])

	return (
		<div className="flex items-center gap-2">
			<Popover>
				<PopoverTrigger asChild>
					<button
						className={cn(
							buttonVariants({ variant: 'secondary', size: 'sm' }),
							'text-sm border-dashed'
						)}
					>
						<Icon name="PlusCircle" size="sm" className="mr-2" />
						{title}
						{selectedValues?.size > 0 && (
							<>
								<Separator orientation="vertical" className="mx-2 h-4" />
								<Badge variant="secondary" className="rounded-sm px-1 font-normal md:hidden">
									{selectedValues.size}
								</Badge>
								<div className="hidden gap-1 md:flex">
									{selectedValues.size > 2 ? (
										<Badge variant="secondary" className="rounded-sm px-1 font-normal">
											{selectedValues.size} selected
										</Badge>
									) : (
										options
											.filter((option) => selectedValues.has(option))
											.map((option, index) => (
												<Badge
													variant="secondary"
													key={index + option}
													className="rounded-sm px-1 font-normal"
												>
													{option}
												</Badge>
											))
									)}
								</div>
							</>
						)}
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0" align="start">
					<Command>
						<CommandInput placeholder={title} className="h-9" />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{options.map((option, index) => {
									const isSelected = selectedValues.has(option)
									return (
										<CommandItem
											key={index + option}
											onSelect={() => {
												if (isSelected) {
													selectedValues.delete(option)
												} else {
													selectedValues.add(option.toString())
												}
												const filterValues = Array.from(selectedValues)
												column?.setFilterValue(filterValues.length ? filterValues : undefined)
											}}
										>
											<Checkbox
												id={option}
												label=""
												value=""
												small
												checked={isSelected}
												onChange={() => {
													if (isSelected) {
														selectedValues.delete(option)
													} else {
														selectedValues.add(option.toString())
													}
													const filterValues = Array.from(selectedValues)
													column?.setFilterValue(filterValues.length ? filterValues : undefined)
												}}
												className="mr-2"
											/>
											<span>{option}</span>
											{facets?.get(option) && (
												<span className="ml-auto flex size-4 items-center justify-center font-mono text-sm">
													{facets.get(option)}
												</span>
											)}
										</CommandItem>
									)
								})}
							</CommandGroup>
							{selectedValues.size > 0 && (
								<>
									<CommandSeparator />
									<CommandGroup>
										<CommandItem
											tabIndex={0}
											onSelect={() => column?.setFilterValue(undefined)}
											className="justify-center rounded focus:border-2 focus:border-brand"
										>
											Clear filters
										</CommandItem>
									</CommandGroup>
								</>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}

// ----- DataTableResetFilterButton

export type DataTableResetFilterButtonProps<TData> = {
	table: Table<TData>
}

function DataTableResetFilterButton<TData>({ table }: DataTableResetFilterButtonProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<>
			{isFiltered && (
				<Button
					variant="ghost"
					onClick={() => table.resetColumnFilters()}
					className="h-8 px-2 lg:px-3"
					iconName="X"
					size="sm"
				>
					Reset
				</Button>
			)}
		</>
	)
}

// ----- DataTableFilter exports

export { DataTableFilter, DataTableResetFilterButton }
