import React from 'react'
import { cn } from '@/utils/cn'

// good guide for complicated and irregular tables https://www.w3.org/WAI/tutorials/tables/irregular/

// ------------------------------------- Table

const Table = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const wrapperStyles = cn('w-full overflow-auto', className)
	const tableStyles = 'w-full caption-bottom text-sm text-gray-500'

	return (
		<div className={wrapperStyles}>
			<table className={tableStyles} {...props} />
		</div>
	)
}

// ------------------------------------- Table Header

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
	const styles = cn('[&_tr]:border-b group', className)

	return <thead className={styles} {...props} data-header />
}

// ------------------------------------- Table Body

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
	const styles = cn('[&_tr:last-child]:border-0', className)

	return <tbody className={styles} {...props} />
}

// ------------------------------------- Table Footer

const TableFooter = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
	const styles = cn('bg-gray-900 font-medium', className)

	return <tfoot className={styles} {...props} />
}

// ------------------------------------- Table Row

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
	const styles = cn(
		'border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100 group-data-[header]:hover:bg-transparent',
		className
	)

	return <tr className={styles} {...props} />
}

// ------------------------------------- Table Head

const TableHead = ({
	className,
	scope = 'col',
	...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => {
	const styles = cn(
		'h-10 px-4 text-left align-middle font-medium text-gray-500[&:has([role=checkbox])]:pr-0',
		className
	)

	return (
		<th
			scope={scope} // https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Advanced#the_scope_attribute
			className={styles}
			{...props}
		/>
	)
}

// ------------------------------------- Table Cell

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => {
	const styles = cn('px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0', className)

	return <td className={styles} {...props} />
}

// ------------------------------------- Table Caption

const TableCaption = ({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => {
	const styles = cn('mt-4 text-sm text-gray-500', className)

	return <caption className={styles} {...props} />
}

// ------------------------------------- Table Exports

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
