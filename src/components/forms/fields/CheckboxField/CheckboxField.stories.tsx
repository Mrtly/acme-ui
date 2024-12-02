import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { Button } from '@/components/buttons/Button'
import { CheckboxField } from '@/forms/fields/CheckboxField'

import { screen, userEvent, within, expect } from '@storybook/test'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'

const FormSchema = z.object({
	test_checkbox: z.boolean().refine((v) => v === true, {
		message: 'You must check this box.',
	}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const CheckboxFieldDemo = ({
	label,
	description,
	disabled,
	readOnly,
	srOnlyDescription,
	required,
}: {
	label: string
	description?: string
	disabled?: boolean
	readOnly?: boolean
	srOnlyDescription?: boolean
	required?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<Form formMethods={form} formName="checkbox form" onSubmit={onSubmit} className="w-80">
				<CheckboxField
					id="cbox"
					control={form.control}
					name="test_checkbox"
					label={label}
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
				/>
				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

const meta: Meta<typeof CheckboxFieldDemo> = {
	title: 'Forms/Fields/CheckboxField',
	render: ({ ...args }) => (
		<CheckboxFieldDemo
			label={args.label}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
			required={args.required}
		/>
	),
	args: {
		label: 'This is a test checkbox',
		description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const checkbox = canvas.getByLabelText(new RegExp(args.label, 'i'))
		expect(checkbox).toBeVisible()
		expect(checkbox).toHaveAccessibleName()
		if (args.description) {
			expect(checkbox).toHaveAccessibleDescription()
		}
		expect(canvas.getByText(args.label)).toBeVisible()
		expect(checkbox).not.toBeChecked()
		if (args.disabled) {
			expect(checkbox).toBeDisabled()
		} else {
			expect(checkbox).not.toBeDisabled()

			await userEvent.click(checkbox, { delay: 50 })
			expect(checkbox).toBeChecked()

			const submit = canvas.getByRole('button', { name: 'Submit' })
			await userEvent.click(submit)
			expect(
				screen.getByRole('alertdialog', {
					name: 'You submitted the following values:',
				})
			).toBeVisible()
			const dismissToast = screen.getByRole('button', { name: 'Dismiss' })
			await userEvent.click(dismissToast)
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			expect(checkbox).toBeRequired()
		} else if (!args.required) {
			expect(canvas.getByText('(optional)')).toBeInTheDocument()
			expect(checkbox).not.toBeRequired()
		}
	},
}

export default meta

type Story = StoryObj<typeof CheckboxFieldDemo>

export const Default: Story = {}
