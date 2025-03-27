import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect, userEvent, fireEvent, waitFor } from '@storybook/test'
import { createMockDataTransferEvent } from './test-helper'
import { DropZone, defaultTextContent } from './DropZone'

// @ts-expect-error args any type
const DropZoneDemo = ({ args }) => {
	const [files, setFiles] = useState<File | File[] | null>([])

	return (
		// key args so component re-renders when args change
		<div className="max-w-md" key={JSON.stringify(args)}>
			<DropZone
				allowsMultiple={args.allowsMultiple}
				multipleFilesLimit={args.multipleFilesLimit}
				acceptType={args.acceptType}
				onSelect={(x) => setFiles(x)}
				onRemove={() => setFiles(null)}
				maxSizeInBytes={args.maxSizeInBytes}
				textContent={args.textContent}
			/>

			{/* temp sanity checks - will remove */}
			<div className="text-sm font-mono text-gray-500 mt-32">
				{/* @ts-expect-error - files is a File or File[] */}
				<div>files.length: {files?.length}</div>
			</div>
		</div>
	)
}

const meta: Meta = {
	title: 'Inputs/DropZone',
	render: ({ ...args }) => <DropZoneDemo args={args} />,
	args: {
		allowsMultiple: false,
		acceptType: 'image/*, application/pdf',
		multipleFilesLimit: 5,
		maxSizeInBytes: 1048576, //1MB
		textContent: {
			...defaultTextContent,
			acceptedTypesText: 'Accepts image or pdf files',
		},
	},
	argTypes: {
		acceptType: {
			control: 'select',
			options: [
				'/*',
				'image/*',
				'application/pdf',
				'image/*, application/pdf',
				'text/csv',
				'text/*',
			],
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		const dropzone = canvas.getByTestId('dropzoneTestId')
		await expect(dropzone).toBeVisible()
		const input = canvas.getByTestId('fileInputTestId')
		await expect(input).toBeInTheDocument()

		//test input
		const file = new File(['testPngFile'], 'testPngFile.png', {
			type: 'image/png',
		})
		Object.defineProperty(file, 'size', { value: 12345 }) //less than 1MB

		await userEvent.upload(input, file)
		await expect(canvas.getByText(/File selected/)).toBeVisible()
		await expect(canvas.getByText('testPngFile.png')).toBeVisible()

		let removeBtn = within(dropzone).getByRole('button', { name: 'Remove file' })
		await expect(removeBtn).toBeVisible()
		await removeBtn.click()
		await expect(canvas.getByText('Drop file here')).toBeVisible()

		//test drop

		// The data transfer api is not supported ? drop is null
		// const File = new File(['Image'], 'Image.png', { type: 'image/png' })
		// const DataTransfer = new DataTransfer()
		// DataTransfer.items.add(File)
		// const DropEvent = new DragEvent('drop', { dataTransfer: DataTransfer })
		// await fireEvent.drop(dropzone, DropEvent)

		//using the mock instead
		const dropEvent = createMockDataTransferEvent('drop', [file], 'move')

		await fireEvent(dropzone, dropEvent)

		await waitFor(async () => {
			await expect(canvas.getByText(/File selected/)).toBeVisible()
		})
		await expect(canvas.getByText(/testPngFile.png/)).toBeVisible()

		//need to reassign the remove button as its a new one
		removeBtn = within(dropzone).getByRole('button', { name: 'Remove file' })
		await removeBtn.click()
		await expect(canvas.getByText('Drop file here')).toBeVisible()
	},
}

export default meta

export const Default: StoryObj = {}
