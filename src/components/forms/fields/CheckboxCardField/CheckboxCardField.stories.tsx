import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { Button } from '@/components/buttons/Button'
import { CheckboxCardField } from './CheckboxCardField'

import { screen, userEvent, within, expect } from '@storybook/test'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'

const FormSchema = z.object({
	test_checkboxCard: z.boolean().refine((v) => v === true, {
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

const CheckboxCardFieldDemo = ({
	label,
	description,
	disabled,
	readOnly,
	srOnlyDescription,
	required,
	rightSlot,
}: {
	label: string
	description?: string
	disabled?: boolean
	readOnly?: boolean
	srOnlyDescription?: boolean
	required?: boolean
	rightSlot?: React.ReactNode
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<Form formMethods={form} formName="checkbox card form" onSubmit={onSubmit} className="w-80">
				<CheckboxCardField
					id="cbox"
					control={form.control}
					name="test_checkboxCard"
					label={label}
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					className="max-w-max"
					rightSlot={rightSlot}
				/>
				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

const meta: Meta<typeof CheckboxCardFieldDemo> = {
	title: 'Forms/Fields/CheckboxCardField',
	render: ({ ...args }) => (
		<CheckboxCardFieldDemo
			label={args.label}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
			required={args.required}
			rightSlot={args.rightSlot}
		/>
	),
	args: {
		label: 'This is a test CheckboxCard',
		description: 'Praesent commodo cursus magna.',
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		required: true,
		rightSlot: '',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const checkboxCard = canvas.getByLabelText(new RegExp(args.label, 'i'))
		expect(checkboxCard).toBeVisible()
		expect(checkboxCard).toHaveAccessibleName()
		if (args.description) {
			expect(checkboxCard).toHaveAccessibleDescription()
		}
		expect(canvas.getByText(args.label)).toBeVisible()
		expect(checkboxCard).not.toBeChecked()
		if (args.disabled) {
			expect(checkboxCard).toBeDisabled()
		} else {
			expect(checkboxCard).not.toBeDisabled()

			await userEvent.click(checkboxCard, { delay: 50 })
			expect(checkboxCard).toBeChecked()

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
			expect(checkboxCard).toBeRequired()
		} else if (!args.required) {
			expect(canvas.getByText('(optional)')).toBeInTheDocument()
			expect(checkboxCard).not.toBeRequired()
		}
	},
}

export default meta

type Story = StoryObj<typeof CheckboxCardFieldDemo>

export const Default: Story = {}
