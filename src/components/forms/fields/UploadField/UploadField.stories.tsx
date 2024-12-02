import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { UploadField } from './UploadField'
import { Button } from '@/components/buttons/Button'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast'
import { within, expect } from '@storybook/test'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const ImageSchema = z.object({
	file: z
		.custom<File>((file) => file, {
			message: 'An image file is required.',
		})
		.refine((file) => file && file?.size <= 5000000, `Max image size is 5MB.`)
		.refine(
			(file) => file && ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		),
	// .optional(),
})

const FileSchema = z.object({
	file: z
		.custom<File>((file) => file, {
			message: 'A file is required.',
		})
		.refine((file) => file && file?.size <= 5000000, `Max image size is 5MB.`),
	// .optional(),
})

const onSubmit = (data: z.infer<typeof ImageSchema>) => {
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

const ImageDemo = ({
	label,
	description,
	srOnlyLabel,
	srOnlyDescription,
	disabled,
	showPreview,
	required,
	showOptional,
}: {
	label: string
	description: string
	srOnlyLabel?: boolean
	srOnlyDescription?: boolean
	disabled?: boolean
	showPreview?: boolean
	required?: boolean
	showOptional?: boolean
}) => {
	const form = useForm<z.infer<typeof ImageSchema>>({
		resolver: zodResolver(ImageSchema),
	})

	return (
		<div className="max-w-sm">
			<Form formMethods={form} formName="upload image form" onSubmit={onSubmit}>
				<UploadField
					filetype="image"
					name="file"
					id="file"
					accept="image/png,image/jpg,image/jpeg,image/webp"
					control={form.control}
					label={label}
					description={description}
					srOnlyLabel={srOnlyLabel}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					showPreview={showPreview}
					required={required}
					showOptional={showOptional}
				/>
				<Button type="submit" className="mt-16">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const FileDemo = ({
	label,
	description,
	srOnlyLabel,
	srOnlyDescription,
	disabled,
	showPreview,
	required,
	showOptional,
}: {
	label: string
	description: string
	srOnlyLabel?: boolean
	srOnlyDescription?: boolean
	disabled?: boolean
	showPreview?: boolean
	required?: boolean
	showOptional?: boolean
}) => {
	const form = useForm<z.infer<typeof FileSchema>>({
		resolver: zodResolver(FileSchema),
	})

	return (
		<div className="max-w-sm">
			<Form formMethods={form} formName="upload file form" onSubmit={onSubmit}>
				<UploadField
					filetype="file"
					name="file"
					id="file"
					control={form.control}
					label={label}
					srOnlyLabel={srOnlyLabel}
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					showPreview={showPreview}
					required={required}
					showOptional={showOptional}
				/>
				<Button type="submit" className="mt-16">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof ImageDemo> = {
	title: 'Forms/Fields/UploadField',
	render: ({
		label,
		description,
		srOnlyLabel,
		srOnlyDescription,
		disabled,
		showPreview,
		required,
		showOptional,
	}) => (
		<ImageDemo
			label={label}
			srOnlyLabel={srOnlyLabel}
			description={description}
			srOnlyDescription={srOnlyDescription}
			disabled={disabled}
			showPreview={showPreview}
			required={required}
			showOptional={showOptional}
		/>
	),
	args: {
		label: 'Upload your avatar',
		description: '.jpg, .jpeg, .png or .webp file format',
		srOnlyLabel: false,
		srOnlyDescription: false,
		disabled: false,
		showPreview: true,
		required: false,
		showOptional: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		let uploadField
		if (!args.disabled) {
			uploadField = canvas.getByLabelText(new RegExp(args.label, 'i'))
			await expect(uploadField).toBeInTheDocument()
			await expect(uploadField).toHaveAccessibleName()
			if (args.description) {
				await expect(uploadField).toHaveAccessibleDescription()
			}
			await expect(uploadField).toHaveClass('opacity-0')
			// cannot test userEvent.upload, the test util env does not support new File
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(uploadField).toBeRequired()
		} else if (!args.required) {
			if (args.showOptional) {
				await expect(canvas.getAllByText('(optional)')[0]).toBeInTheDocument()
			}
			expect(uploadField).not.toBeRequired()
		}
	},
}

export default meta

type Story = StoryObj<typeof ImageDemo>

export const Image: Story = {}

export const File: Story = {
	render: ({ label, description, srOnlyDescription, disabled, required, showOptional }) => (
		<FileDemo
			label={label}
			description={description}
			srOnlyDescription={srOnlyDescription}
			disabled={disabled}
			required={required}
			showOptional={showOptional}
		/>
	),
	args: {
		label: 'Upload a file',
		description: 'Select a file to upload',
		srOnlyDescription: false,
		disabled: false,
		required: false,
		showOptional: true,
	},
}
