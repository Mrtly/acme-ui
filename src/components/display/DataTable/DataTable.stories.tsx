import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

// tanstack table imports
import {
	ColumnDef,
	ColumnFiltersState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'

// DataTable components
import { DataTableGlobalSearch } from './DataTableSearch' // or DataTableColumnSearch
import { DataTableFilter, DataTableResetFilterButton } from './DataTableFilter'
import { DataTableViewOptions } from './DataTableViewOptions'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import { DataTableActionsMenu, DataTableCheckbox } from './DataTableRowActions'
import { DataTable, DataTableBody, DataTableCaption, DataTableHeader } from './DataTableRender'
import { DataTablePagination } from './DataTablePagination'
import { CodeBlock } from '@/components/visualization/CodeBlock'
import { Link } from 'src/utility/Link'
import { expect, screen, userEvent, waitFor, within } from '@storybook/test'

// docs: https://tanstack.com/table/v8/docs/guide/introduction
// examples by shadcn: https://ui.shadcn.com/docs/components/data-table
// https://ui.shadcn.com/examples/tasks

// table data type
type DataType = {
	id: string
	description: string
	status: string
	priority: string
}

// table data
const tasks = [
	{
		id: 'TASK-2468',
		description: 'Create user personas based on research data',
		status: 'Todo',
		priority: 'High',
	},
	{
		id: 'TASK-1357',
		description: 'Implement UI updates based on user feedback',
		status: 'In progress',
		priority: 'Low',
	},
	{
		id: 'TASK-3698',
		description: 'Design micro-interactions for app engagement',
		status: 'Backlog',
		priority: 'Medium',
	},
	{
		id: 'TASK-8024',
		description: 'Optimize UI/UX for cross-browser compatibility',
		status: 'Done',
		priority: 'High',
	},
	{
		id: 'TASK-5791',
		description: 'Create clickable prototypes for usability testing',
		status: 'Todo',
		priority: 'Medium',
	},
	{
		id: 'TASK-8782',
		description: 'Design login page layout',
		status: 'Todo',
		priority: 'High',
	},
	{
		id: 'TASK-5674',
		description: 'Create wireframes for user profile section',
		status: 'Done',
		priority: 'Low',
	},
	{
		id: 'TASK-9321',
		description: 'Implement responsive design for dashboard',
		status: 'In progress',
		priority: 'Medium',
	},
	{
		id: 'TASK-4123',
		description: 'Conduct user testing on navigation menu',
		status: 'Backlog',
		priority: 'High',
	},
	{
		id: 'TASK-7598',
		description: 'Optimize images for better page load speed',
		status: 'Todo',
		priority: 'Low',
	},
	{
		id: 'TASK-6783',
		description: 'Refactor CSS code for better readability',
		status: 'In progress',
		priority: 'High',
	},
	{
		id: 'TASK-1234',
		description: 'Create interactive prototypes for new feature',
		status: 'Backlog',
		priority: 'Low',
	},
	{
		id: 'TASK-8945',
		description: 'Design UI elements for chat feature',
		status: 'Done',
		priority: 'Medium',
	},
	{
		id: 'TASK-2345',
		description: 'Implement color scheme as per brand guidelines',
		status: 'Todo',
		priority: 'High',
	},
	{
		id: 'TASK-6732',
		description: 'Review and improve UI/UX for checkout process',
		status: 'In progress',
		priority: 'Low',
	},
	{
		id: 'TASK-5678',
		description: 'Create style guide for consistent UI across the app',
		status: 'Backlog',
		priority: 'Medium',
	},
	{
		id: 'TASK-8765',
		description: 'Fix alignment issues on mobile devices',
		status: 'Done',
		priority: 'High',
	},
	{
		id: 'TASK-9876',
		description: 'Add animations to enhance user interactions',
		status: 'Todo',
		priority: 'Medium',
	},
	{
		id: 'TASK-4567',
		description: 'Optimize UI for accessibility compliance',
		status: 'In progress',
		priority: 'Low',
	},
	{
		id: 'TASK-3456',
		description: 'Conduct A/B testing on landing page design',
		status: 'Backlog',
		priority: 'Medium',
	},
] satisfies DataType[]

// define & customize column headers
const columns: ColumnDef<DataType>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<DataTableCheckbox
				id="all"
				label="Select all"
				checked={table.getIsAllPageRowsSelected()}
				onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			/>
		),
		cell: ({ row }) => (
			<DataTableCheckbox
				id={row.getValue('id')}
				label="Select row"
				checked={row.getIsSelected()}
				onChange={(value) => row.toggleSelected(!!value)}
			/>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'id',
		header: 'Task ID',
		cell: ({ row }) => <div>{row.getValue('id')}</div>,
		enableHiding: false,
	},
	{
		accessorKey: 'description', //accessorKey is needed for searching/filtering
		header: ({ column }) => {
			return (
				<DataTableColumnHeader
					column={column}
					title="Description"
					// className=''
				/>
			)
		},
		cell: ({ row }) => <div>{row.getValue('description')}</div>,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Status" enableSorting />
		},
		cell: ({ row }) => <div>{row.getValue('status')}</div>,
		// add this filterFn if this column is filtered by DataTableFilter
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	},
	{
		accessorKey: 'priority',
		header: ({ column }) => {
			return <DataTableColumnHeader column={column} title="Priority" enableSorting />
		},
		cell: ({ row }) => <div>{row.getValue('priority')}</div>,
		// add this filterFn if this column is filtered by DataTableFilter
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id))
		},
	},
	{
		id: 'actions',
		header: ({ column }) => {
			return (
				// for accessibility, column headers must have a title
				// add class 'sr-only' to the title to visually hide it
				<DataTableColumnHeader column={column} title="Actions" className="sr-only" />
			)
		},
		cell: ({ row }) => {
			const item = row.original
			// define options as {displayName: string | ReactNode, action: () => {}}[]
			const options = [
				{
					displayName: 'View',
					action: () => console.log(item),
				},
				{ displayName: 'Mark as done', action: () => console.log(item) },
			]
			return <DataTableActionsMenu options={options} />
		},
	},
]

// Data Table component for demo
const DataTableDemo = () => {
	// if using column sorting
	const [sorting, setSorting] = React.useState<SortingState>([])

	// if using single column filter
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	// if using global filter (all columns)
	const [globalFilter, setGlobalFilter] = React.useState('')

	// if using the ViewOptions filter
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

	// if using checkboxes for row selection
	const [rowSelection, setRowSelection] = React.useState({})

	// custom controlled pagination is not in the docs
	// see example https://codesandbox.io/p/devbox/tanstack-table-example-pagination-controlled-2x8b5w?file=%2Fsrc%2Fmain.tsx
	// only add this if using custom pagination
	const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 6,
	})

	const pagination = React.useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	)

	// create the table instance
	const table = useReactTable({
		data: tasks,
		// columns
		columns,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		// rows
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: setRowSelection,
		getFilteredRowModel: getFilteredRowModel(),
		// sorting
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		// pagination
		onPaginationChange: setPagination, // only add this if using custom pagination
		getPaginationRowModel: getPaginationRowModel(),
		// global filter
		onGlobalFilterChange: setGlobalFilter,
		// state
		state: {
			sorting,
			columnFilters, // if using single column filter
			globalFilter, // if using global filter (all columns)
			columnVisibility,
			rowSelection,
			pagination, // only add this if using custom pagination
		},
	})

	React.useEffect(() => {
		// on mobile hide some columns (they are still available on the View filter)
		if (window?.matchMedia('only screen and (max-width: 760px)').matches) {
			setColumnVisibility({ status: false, priority: false, actions: false })
		}
	}, [])

	return (
		<>
			{/* table search/filter tools */}
			<div className="w-full flex items-center justify-between py-2">
				<div className="flex items-center gap-2">
					{/* if using global search, declare the [globalFilter, setGlobalFilter] */}
					<DataTableGlobalSearch
						placeholder="Search all columns"
						value={globalFilter ?? ''}
						onValueChange={(value: string) => setGlobalFilter(String(value))}
					/>
					{/* if using single column search, declare the [columnFilters, setColumnFilters] */}
					{/* <DataTableColumnSearch
						table={table}
						searchColumn="description"
						placeholder="Search descriptions"
					/> */}
					<DataTableFilter
						column={table.getColumn('status')}
						title="Status"
						options={['Backlog', 'Todo', 'In progress', 'Done']}
					/>
					<DataTableFilter
						column={table.getColumn('priority')}
						title="Priority"
						options={['Low', 'Medium', 'High']}
					/>
					<DataTableResetFilterButton table={table} />
				</div>
				<DataTableViewOptions table={table} />
			</div>

			{/* table */}
			<DataTable className="">
				{/* a table caption is good for accessibility, visually-hide it with 'sr-only' class */}
				<DataTableCaption className="sr-only">Tasks table demo</DataTableCaption>

				{/* renders the table header cells using the table display functions */}
				<DataTableHeader table={table} className="" />

				{/* renders the table body cells using the table display functions */}
				<DataTableBody table={table} />
			</DataTable>

			{/* table pagination tools */}
			<DataTablePagination table={table} pageSizes={[5, 6, 10, 15]} />
		</>
	)
}

const meta: Meta = {
	title: 'Display/DataTable',
	render: () => <DataTableDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		if (!canvas.queryByRole('table', { name: 'Tasks table demo' })) {
			return //tests only for 'Tasks table demo' story (do not run on the Starter Kit story)
		}
		const table = canvas.getByRole('table', { name: 'Tasks table demo' })
		expect(table).toBeInTheDocument()

		//header
		const tableHead = canvas.getByTestId('table-header')
		expect(tableHead).toBeInTheDocument()

		const columnHeads = ['Task ID', 'Description', 'Status', 'Priority', 'Actions']

		columnHeads.forEach((h) => {
			expect(within(tableHead).getByText(h)).toBeInTheDocument()
		})

		const sortStatusBtn = within(within(tableHead).getByText('Status')).getByRole('button', {
			name: 'Sort Ascending',
		})
		expect(sortStatusBtn).toBeInTheDocument()
		const sortPriorityBtn = within(within(tableHead).getByText('Priority')).getByRole('button', {
			name: 'Sort Ascending',
		})
		expect(sortPriorityBtn).toBeInTheDocument()

		//rows checkbox, select rows, options menu
		const checkbox = canvas.getAllByRole('checkbox', { name: 'Select row' })[0]
		expect(checkbox).toBeInTheDocument()
		expect(checkbox).not.toBeChecked()
		expect(canvas.getByText('0 of 20 rows selected')).toBeInTheDocument()
		await userEvent.click(checkbox)
		expect(checkbox).toBeChecked()
		expect(canvas.getByText('1 of 20 rows selected')).toBeInTheDocument()

		const optionsMenu = canvas.getAllByRole('button', {
			name: 'More options',
		})[0]
		expect(optionsMenu).toBeInTheDocument()
		expect(optionsMenu).toHaveAttribute('aria-expanded', 'false')
		await userEvent.click(optionsMenu)
		expect(optionsMenu).toHaveAttribute('aria-expanded', 'true')
		await userEvent.keyboard('{Escape}')

		//pagination
		expect(canvas.getByText('Page 1 of 4')).toBeInTheDocument()
		await userEvent.click(canvas.getByLabelText('next page'))
		expect(canvas.getByText('Page 2 of 4')).toBeInTheDocument()
		await userEvent.click(canvas.getByLabelText('Go to last page'))
		expect(canvas.getByText('Page 4 of 4')).toBeInTheDocument()
		await userEvent.click(canvas.getByLabelText('Go to first page'))
		expect(canvas.getByText('Page 1 of 4')).toBeInTheDocument()

		//show rows select
		expect(canvas.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(6) //viewing 6 rows
		await userEvent.click(canvas.getByLabelText('show rows'))
		await userEvent.click(screen.getByRole('option', { name: '10' }))
		expect(canvas.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(10) //viewing 10 rows
		await userEvent.click(canvas.getByLabelText('show rows'))
		await userEvent.click(screen.getByRole('option', { name: '6' }))
		expect(canvas.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(6) //viewing 6 rows (revert)

		//search
		const search = canvas.getByPlaceholderText('Search all columns')
		await userEvent.type(search, 'Done')
		await waitFor(
			() => expect(canvas.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(4) //viewing 4 rows 'Done'
		)

		userEvent.keyboard('{Tab}') //x button
		await userEvent.keyboard('{Enter}') //clear search
		await waitFor(
			() => expect(canvas.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(6) //viewing 6 rows (revert)
		)

		//filters
		const filterBtn = canvas.getByRole('button', { name: 'Status' })
		expect(filterBtn).toHaveAttribute('aria-haspopup', 'dialog')
		expect(filterBtn).toHaveAttribute('aria-expanded', 'false')
		expect(filterBtn).toHaveAttribute('data-state', 'closed')
		await userEvent.click(filterBtn)
		expect(filterBtn).toHaveAttribute('aria-expanded', 'true')
		expect(filterBtn).toHaveAttribute('data-state', 'open')
		userEvent.click(screen.getByRole('option', { name: 'Done' }))
		await waitFor(
			() => expect(canvas.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(4) //viewing 4 rows 'Done'
		)
		const resetBtn = canvas.getByRole('button', { name: 'Reset' })
		expect(resetBtn).toBeInTheDocument()
		await userEvent.click(resetBtn)
		await waitFor(
			() => expect(canvas.getAllByRole('checkbox', { name: 'Select row' })).toHaveLength(6) //viewing 6 rows (revert)
		)

		//view column filter
		const view = canvas.getByRole('button', { name: 'View' })
		expect(view).toBeInTheDocument()
		expect(view).toHaveAttribute('aria-haspopup', 'menu')
		expect(view).toHaveAttribute('aria-expanded', 'false')
		expect(view).toHaveAttribute('data-state', 'closed')
		await userEvent.click(view)
		expect(view).toHaveAttribute('aria-expanded', 'true')
		expect(view).toHaveAttribute('data-state', 'open')
		userEvent.click(screen.getByRole('menuitemcheckbox', { name: 'status' }))
		await waitFor(() => expect(within(tableHead).queryByText('status')).not.toBeInTheDocument())
	},
}

export default meta

export const Default: StoryObj = {}

export const StarterKit: StoryObj = {
	render: () => (
		<div className="flex flex-col gap-2">
			<h1> DataTable Starter Kit</h1>
			<div>Copy this starter code and paste it into your application to get started</div>
			<Link
				href="/?path=/docs/display-datatable--docs"
				className="self-end"
				iconName="ArrowRight"
				size="sm"
			>
				DataTable docs
			</Link>
			<CodeBlock
				code={`'use client'
import React from 'react'
import {
  DataTableGlobalSearch,
  DataTableFilter,
  DataTableResetFilterButton,
  DataTableViewOptions,
  DataTableColumnHeader,
  DataTableActionsMenu,
  DataTableCheckbox,
  DataTable,
  DataTableCaption,
  DataTableBody,
  DataTableHeader,
  DataTablePagination,
} from '@acme-gds/ui'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table'

const tasks = [
  {
    id: 'TASK-2468',
    description: 'Create user personas based on research data',
    status: 'Todo',
    priority: 'High',
  },
  {
    id: 'TASK-1357',
    description: 'Implement UI updates based on user feedback',
    status: 'In progress',
    priority: 'Low',
  },
  {
    id: 'TASK-3698',
    description: 'Design micro-interactions for app engagement',
    status: 'Backlog',
    priority: 'Medium',
  },
  {
    id: 'TASK-8024',
    description: 'Optimize UI/UX for cross-browser compatibility',
    status: 'Done',
    priority: 'High',
  },
  {
    id: 'TASK-5791',
    description: 'Create clickable prototypes for usability testing',
    status: 'Todo',
    priority: 'Medium',
  },
  {
    id: 'TASK-8782',
    description: 'Design login page layout',
    status: 'Todo',
    priority: 'High',
  },
  {
    id: 'TASK-5674',
    description: 'Create wireframes for user profile section',
    status: 'Done',
    priority: 'Low',
  },
  {
    id: 'TASK-9321',
    description: 'Implement responsive design for dashboard',
    status: 'In progress',
    priority: 'Medium',
  },
  {
    id: 'TASK-4123',
    description: 'Conduct user testing on navigation menu',
    status: 'Backlog',
    priority: 'High',
  },
  {
    id: 'TASK-7598',
    description: 'Optimize images for better page load speed',
    status: 'Todo',
    priority: 'Low',
  },
  {
    id: 'TASK-6783',
    description: 'Refactor CSS code for better readability',
    status: 'In progress',
    priority: 'High',
  },
  {
    id: 'TASK-1234',
    description: 'Create interactive prototypes for new feature',
    status: 'Backlog',
    priority: 'Low',
  },
  {
    id: 'TASK-8945',
    description: 'Design UI elements for chat feature',
    status: 'Done',
    priority: 'Medium',
  },
  {
    id: 'TASK-2345',
    description: 'Implement color scheme as per brand guidelines',
    status: 'Todo',
    priority: 'High',
  },
  {
    id: 'TASK-6732',
    description: 'Review and improve UI/UX for checkout process',
    status: 'In progress',
    priority: 'Low',
  },
  {
    id: 'TASK-5678',
    description: 'Create style guide for consistent UI across the app',
    status: 'Backlog',
    priority: 'Medium',
  },
  {
    id: 'TASK-8765',
    description: 'Fix alignment issues on mobile devices',
    status: 'Done',
    priority: 'High',
  },
  {
    id: 'TASK-9876',
    description: 'Add animations to enhance user interactions',
    status: 'Todo',
    priority: 'Medium',
  },
  {
    id: 'TASK-4567',
    description: 'Optimize UI for accessibility compliance',
    status: 'In progress',
    priority: 'Low',
  },
  {
    id: 'TASK-3456',
    description: 'Conduct A/B testing on landing page design',
    status: 'Backlog',
    priority: 'Medium',
  },
] satisfies DataType[]

const columns: ColumnDef<DataType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <DataTableCheckbox
        id="all"
        label="Select all"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <DataTableCheckbox
        id={row.getValue('id')}
        label="Select row"
        checked={row.getIsSelected()}
        onChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'id',
    header: 'Task ID',
    cell: ({ row }) => <div>{row.getValue('id')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Description" />
    },
    cell: ({ row }) => <div>{row.getValue('description')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Status" enableSorting />
      )
    },
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Priority" enableSorting />
      )
    },
    cell: ({ row }) => <div>{row.getValue('priority')}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Actions"
          className="sr-only"
        />
      )
    },
    cell: ({ row }) => {
      const item = row.original
      const options = [
        { displayName: 'View', action: () => console.log(item) },
        { displayName: 'Mark as done', action: () => console.log(item) },
      ]
      return <DataTableActionsMenu options={options} />
    },
  },
]

const DataTableDemo = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = React.useState('')

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [rowSelection, setRowSelection] = React.useState({})

  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 6,
    })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data: tasks,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  React.useEffect(() => {
    if (window?.matchMedia('only screen and (max-width: 760px)').matches) {
      setColumnVisibility({ status: false, priority: false, actions: false })
    }
  }, [])

  return (
    <>
      <div className="w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <DataTableGlobalSearch
            placeholder="Search all columns"
            value={globalFilter ?? ''}
            onValueChange={(value: string) => setGlobalFilter(String(value))}
          />

          <DataTableFilter
            column={table.getColumn('status')}
            title="Status"
            options={['Backlog', 'Todo', 'In progress', 'Done']}
          />
          <DataTableFilter
            column={table.getColumn('priority')}
            title="Priority"
            options={['Low', 'Medium', 'High']}
          />
          <DataTableResetFilterButton table={table} />
        </div>
        <DataTableViewOptions table={table} />
      </div>

      <DataTable className="">
        <DataTableCaption className="sr-only">
          Tasks table demo
        </DataTableCaption>

        <DataTableHeader table={table} className="" />

        <DataTableBody table={table} />
      </DataTable>

      <DataTablePagination table={table} pageSizes={[5, 6, 10, 15]} />
    </>
  )
}

export default function Page() {
  return (
    <div>
      <DataTableDemo />
    </div>
  )
}`}
			/>
		</div>
	),
}
