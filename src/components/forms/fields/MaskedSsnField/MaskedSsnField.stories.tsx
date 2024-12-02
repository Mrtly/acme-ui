import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'
import { MaskedSsnField, MaskedSsnFieldSchema } from './MaskedSsnField'
import { within, expect, userEvent, waitFor } from '@storybook/test'

const FormSchema = z.object({
	ssn: MaskedSsnFieldSchema,
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const SsnDemo = ({
	label,
	srOnlyLabel,
	description,
	srOnlyDescription,
	disabled,
	required,
}: {
	label: string
	srOnlyLabel?: boolean
	description?: string
	srOnlyDescription?: boolean
	disabled?: boolean
	required?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		// defaultValues: {
		// 	ssn: '123-34-5567',
		// },
	})

	return (
		<div className="max-w-[220px]">
			<Form formMethods={form} formName="Masked ssn form" onSubmit={onSubmit}>
				<MaskedSsnField
					id="ssn"
					name="ssn"
					control={form.control}
					label={label}
					srOnlyLabel={srOnlyLabel}
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
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

const meta: Meta<typeof SsnDemo> = {
	title: 'Forms/Fields/MaskedSsnField',
	render: ({ label, srOnlyLabel, description, srOnlyDescription, disabled, required }) => (
		<SsnDemo
			label={label}
			srOnlyLabel={srOnlyLabel}
			description={description}
			srOnlyDescription={srOnlyDescription}
			disabled={disabled}
			required={required}
		/>
	),
	args: {
		label: 'Social Security Number',
		srOnlyLabel: false,
		description: 'Your SSN',
		srOnlyDescription: false,
		disabled: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const input = canvas.getByLabelText(new RegExp(args.label, 'i'))
		await expect(input).toBeInTheDocument()
		await expect(input).toHaveAccessibleName()
		if (args.description) {
			await expect(input).toHaveAccessibleDescription()
		}
		if (args.disabled) {
			await expect(input).toBeDisabled()
		} else {
			expect(input).not.toBeDisabled()
			await userEvent.click(input)
			await userEvent.type(input, '123456789', { delay: 50 })
			await expect(input).toHaveValue('123-45-6789')
			await expect(input).toHaveAttribute('data-mask', '***-**-6789')
			await expect(input).toHaveAttribute('data-ismasked', 'false')
			input.blur()
			await waitFor(async () => {
				await expect(input).toHaveAttribute('data-ismasked', 'true')
				await expect(canvas.getByText('***-**-6789')).toBeVisible()
			})
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(input).toBeRequired()
		} else if (!args.required) {
			await expect(canvas.getByText('(optional)')).toBeInTheDocument()
			expect(input).not.toBeRequired()
		}
	},
}

export default meta

type Story = StoryObj<typeof SsnDemo>

export const Default: Story = {}
