import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'
import {
	MaskedInputField,
	MaskedInputAccountSchema,
	MaskedInputZipSchema,
} from '@/forms/fields/MaskedInputField'
import { screen, userEvent, within, expect } from '@storybook/test'

const FormSchema = z.object({
	account_number: MaskedInputAccountSchema,
	zip_code: MaskedInputZipSchema,
	dollar_amount: z
		.number({ required_error: 'Add amount.' })
		.refine((v) => v >= 10, 'Maximum amount is $10.')
		.refine((v) => v <= 1000, 'Maximum amount is $1000.'),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const InputDemo = ({
	required,
	disabled,
	readOnly,
}: {
	required?: boolean
	disabled?: boolean
	readOnly?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		// defaultValues: {
		// account_number: '4444-4444-5555-5555',
		// zip_code: '12345',
		// dollar_amount: 12.34,
		// },
	})

	return (
		<div className="max-w-[220px]">
			<Form
				formMethods={form}
				formName="Masked input fields form"
				onSubmit={onSubmit}
				className="flex flex-col gap-4"
			>
				<MaskedInputField
					id="account-number"
					name="account_number"
					label="Account number"
					maskType="account"
					control={form.control}
					description="16-digit account number"
					placeholder="xxxx-xxxx-xxxx-xxxx"
					required={required}
					disabled={disabled}
					readOnly={readOnly}
				/>
				<MaskedInputField
					id="zip-code"
					name="zip_code"
					label="ZIP code"
					maskType="zip"
					control={form.control}
					required={required}
					disabled={disabled}
					readOnly={readOnly}
				/>
				<MaskedInputField
					id="dollar-amount"
					name="dollar_amount"
					label="Payment amount"
					maskType="usd"
					control={form.control}
					required={required}
					disabled={disabled}
					readOnly={readOnly}
					value={form.watch('dollar_amount')?.toFixed(2)}
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
	title: 'Forms/Fields/MaskedInputField',
	render: ({ ...args }) => (
		<InputDemo required={args.required} disabled={args.disabled} readOnly={args.readOnly} />
	),
	args: { required: true, disabled: false, readOnly: false },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const accField = canvas.getByLabelText(/Account number/i)
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(accField).toBeRequired()
		} else if (!args.required) {
			await expect(canvas.getAllByText('(optional)')[0]).toBeInTheDocument()
			expect(accField).not.toBeRequired()
		}
		await expect(accField).toBeInTheDocument()
		await expect(accField).toHaveAccessibleName()
		if (!args.disabled && !args.readOnly) {
			await userEvent.type(accField, '1234 5678 9100 abcd', { delay: 50 })
			await expect(accField).toHaveValue('1234-5678-9100')
			await userEvent.type(accField, '1234', { delay: 50 })
			await expect(accField).toHaveValue('1234-5678-9100-1234')
		}

		const zipField = canvas.getByLabelText(/ZIP code/i)
		await expect(zipField).toBeInTheDocument()
		await expect(zipField).toHaveAccessibleName()
		if (!args.disabled && !args.readOnly) {
			await userEvent.type(zipField, '1234', { delay: 50 })
			zipField.focus()
			await userEvent.keyboard('a')
			await expect(zipField).toHaveValue('1234')
			await userEvent.keyboard('5')
			await expect(zipField).toHaveValue('12345')
		}

		const usdField = canvas.getByLabelText(/Payment amount/i)
		await expect(usdField).toBeInTheDocument()
		await expect(usdField).toHaveAccessibleName()
		if (!args.disabled && !args.readOnly) {
			await userEvent.type(usdField, '105', { delay: 50 })
			await userEvent.type(usdField, '0', { delay: 50 })
			await userEvent.type(usdField, '2', { delay: 50 })
			usdField.focus()
			await userEvent.keyboard('a')
			await expect(usdField).toHaveValue('105.02')
		}

		if (!args.disabled && !args.readOnly) {
			const submit = canvas.getByRole('button', { name: 'Submit' })
			await userEvent.click(submit)

			await expect(
				screen.getByRole('alertdialog', {
					name: 'You submitted the following values:',
				})
			).toBeVisible()
			const dismissToast = screen.getByRole('button', { name: 'Dismiss' })
			await userEvent.click(dismissToast)
		}
	},
}

export default meta

type Story = StoryObj<typeof InputDemo>

export const Default: Story = {}
