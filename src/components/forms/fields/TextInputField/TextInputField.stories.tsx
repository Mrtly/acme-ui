import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextInputField } from '@/forms/fields/TextInputField'
import { within, expect, userEvent, waitFor } from '@storybook/test'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'

const FormSchema = z.object({
	first_name: z
		.string({
			required_error: 'Enter a valid name.',
		})
		.min(2, 'Name must be longer than 2 characters.'),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const InputDemo = ({
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
			<Form formMethods={form} formName="text input form" onSubmit={onSubmit}>
				<TextInputField
					id="first-name"
					name="first_name"
					type="text"
					label={label}
					srOnlyLabel={srOnlyLabel}
					placeholder="First name"
					autoComplete="name"
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					control={form.control}
				/>
				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof InputDemo> = {
	title: 'Forms/Fields/TextInputField',
	render: ({ ...args }) => (
		<InputDemo
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
		label: 'First Name',
		srOnlyLabel: false,
		description: 'Your first name',
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const input = canvas.getByLabelText(new RegExp(args.label, 'i'))
		expect(input).toBeInTheDocument()
		expect(input).toHaveAccessibleName()
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			expect(input).toBeRequired()
		} else if (!args.required) {
			expect(canvas.getByText('(optional)')).toBeInTheDocument()
			expect(input).not.toBeRequired()
		}
		if (args.description) {
			expect(input).toHaveAccessibleDescription()
		}
		if (args.disabled) {
			expect(input).toBeDisabled()
		} else if (args.readOnly) {
			expect(input).toHaveAttribute('readOnly')
		} else {
			expect(input).not.toBeDisabled()
			await userEvent.click(input) //click because of intermittent userEvent.type bug in new test utils
			await userEvent.type(input, 'name')
			await waitFor(() => expect(input).toHaveValue('name'))
			await userEvent.clear(input)
			expect(input).not.toHaveValue()
			input.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof InputDemo>

export const Default: Story = {}
