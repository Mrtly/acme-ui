import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { DropZoneField, DropZoneFieldProps } from './DropZoneField'
import { Button } from '@/components/buttons/Button'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast'
import { within, expect, userEvent, fireEvent, waitFor } from '@storybook/test'
import { createMockDataTransferEvent } from '@/components/inputs/DropZone/test-helper'
import { defaultTextContent } from '@/components/inputs/DropZone/DropZone'

const FileSchema = z.object({
	file: z
		.custom<File>((file) => file, {
			message: 'A file is required.',
		})
		.refine((file) => file && file?.size <= 5000000, `Max image size is 5MB.`),
	// .optional(),
})

const onSubmit = (data: z.infer<typeof FileSchema>) => {
	console.log(data)

	if (data) {
		addToastToQueue({
			title: 'You submitted:',
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-black p-4">
					<code className="text-white block overflow-x-auto">
						file: {data?.file?.name}
						<br />
						size: {data?.file?.size} bytes
					</code>
				</pre>
			),
		})
	}
}

const DropZoneFieldDemo = (props: DropZoneFieldProps<z.infer<typeof FileSchema>>) => {
	const form = useForm<z.infer<typeof FileSchema>>({
		resolver: zodResolver(FileSchema),
	})

	return (
		<div className="max-w-lg">
			<Form formMethods={form} formName="upload file form" onSubmit={onSubmit}>
				{/* key is used to force a re-render when the story args change */}
				<DropZoneField {...props} name="file" control={form.control} key={JSON.stringify(props)} />
				<Button type="submit" className="mt-16">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof DropZoneFieldDemo> = {
	title: 'Forms/Fields/DropZoneField',
	render: ({ ...args }) => <DropZoneFieldDemo {...args} />,
	args: {
		description: 'Drop or select files to upload',
		srOnlyDescription: false,
		allowsMultiple: false,
		acceptType: 'image/*, application/pdf',
		multipleFilesLimit: 5,
		maxSizeInBytes: 2097152, //2MB
		textContent: {
			...defaultTextContent,
			acceptedTypesText: 'Accepts image or pdf files',
		},
	},
	argTypes: {
		maxSizeInBytes: {
			control: 'number',
		},
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
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		const dropText = args.allowsMultiple ? 'Drop files here' : 'Drop file here'

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
		await expect(canvas.getByText(dropText)).toBeVisible()

		//test drop using the mock from Dropzone stories
		const dropEvent = createMockDataTransferEvent('drop', [file], 'move')

		await fireEvent(dropzone, dropEvent)

		await waitFor(async () => {
			await expect(canvas.getByText(/File selected/)).toBeVisible()
		})
		await expect(canvas.getByText(/testPngFile.png/)).toBeVisible()

		removeBtn = within(dropzone).getByRole('button', { name: 'Remove file' })
		await removeBtn.click()
		await expect(canvas.getByText(dropText)).toBeVisible()
	},
}

export default meta

type Story = StoryObj<typeof DropZoneFieldDemo>

export const Default: Story = {}
