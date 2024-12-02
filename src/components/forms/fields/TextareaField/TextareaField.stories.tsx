import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextareaField } from '@/forms/fields/TextareaField'
import { userEvent, within, expect } from '@storybook/test'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'

const FormSchema = z.object({
	message: z
		.string({
			required_error: 'Add a message.',
		})
		.min(2, 'Add a message.'),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const TextareaFieldDemo = ({
	label,
	srOnlyLabel,
	description,
	srOnlyDescription,
	disabled,
	readOnly,
	required,
}: {
	label: string
	srOnlyLabel?: boolean
	description: string
	srOnlyDescription?: boolean
	error?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div className="max-w-sm">
			<Form formMethods={form} formName="text area form" onSubmit={onSubmit}>
				<TextareaField
					id="message"
					name="message"
					label={label}
					placeholder="Add your message here"
					srOnlyLabel={srOnlyLabel}
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					control={form.control}
				/>
				<Button type="submit" className="mt-4" disabled={disabled}>
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof TextareaFieldDemo> = {
	title: 'Forms/Fields/TextareaField',
	render: ({ ...args }) => (
		<TextareaFieldDemo
			label={args.label}
			srOnlyLabel={args.srOnlyLabel}
			error={args.error}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
			required={args.required}
		/>
	),
	args: {
		label: 'Your message',
		srOnlyLabel: false,
		description: 'Add your request details',
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const textareafield = canvas.getByLabelText(new RegExp(args.label, 'i'))
		expect(textareafield).toBeInTheDocument()
		expect(textareafield).toHaveAccessibleName()
		if (args.description) {
			expect(textareafield).toHaveAccessibleDescription()
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			expect(textareafield).toBeRequired()
		} else if (!args.required) {
			expect(canvas.getByText('(optional)')).toBeInTheDocument()
			expect(textareafield).not.toBeRequired()
		}
		if (args.disabled) {
			expect(textareafield).toBeDisabled()
		} else if (args.readOnly) {
			expect(textareafield).toHaveAttribute('readonly')
		} else {
			expect(textareafield).not.toBeDisabled()
			await userEvent.type(textareafield, 'this is a message', { delay: 50 })
			expect(textareafield).toHaveValue('this is a message')
			await userEvent.clear(textareafield)
			expect(textareafield).not.toHaveValue()
			textareafield.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof TextareaFieldDemo>

export const Default: Story = {}
