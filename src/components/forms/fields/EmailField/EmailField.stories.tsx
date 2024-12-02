import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'
import { EmailField, EmailFieldSchema } from './EmailField'
import { userEvent, within, waitFor, expect } from '@storybook/test'

const FormSchema = z.object({
	email: EmailFieldSchema,
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
			<Form formMethods={form} formName="email form" onSubmit={onSubmit}>
				<EmailField
					id="email"
					name="email"
					label={label}
					srOnlyLabel={srOnlyLabel}
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					control={form.control}
					required={required}
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
	title: 'Forms/Fields/EmailField',
	render: ({
		label,
		srOnlyLabel,
		error,
		description,
		srOnlyDescription,
		disabled,
		readOnly,
		required,
	}) => (
		<InputDemo
			label={label}
			srOnlyLabel={srOnlyLabel}
			error={error}
			description={description}
			srOnlyDescription={srOnlyDescription}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
		/>
	),
	args: {
		label: 'Email address',
		srOnlyLabel: false,
		description: 'Enter your email address',
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const emailField = canvas.getByLabelText(args.label)
		await expect(emailField).toBeInTheDocument()
		await expect(emailField).toHaveAccessibleName()
		args.required && (await expect(emailField).toBeRequired())
		args.description && (await expect(emailField).toHaveAccessibleDescription())
		if (args.readOnly || args.disabled) return

		await userEvent.click(emailField)
		await userEvent.type(emailField, 'abc')
		await expect(emailField).toHaveValue('abc')

		const submit = canvas.getByRole('button', { name: 'Submit' })
		await userEvent.click(submit)
		await waitFor(() =>
			expect(canvas.getByText('Enter a valid email address (name@example.com).')).toBeVisible()
		)
		await expect(emailField).toHaveAttribute('aria-invalid', 'true')

		await userEvent.type(emailField, '@example.com')
		expect(emailField).not.toHaveAttribute('aria-invalid', 'true')
	},
}

export default meta

type Story = StoryObj<typeof InputDemo>

export const Default: Story = {}
