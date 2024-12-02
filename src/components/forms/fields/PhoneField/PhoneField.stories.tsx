import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'
import { PhoneField, PhoneFieldSchema } from './PhoneField'
import { within, expect, userEvent } from '@storybook/test'

const FormSchema = z.object({
	phone: PhoneFieldSchema,
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const PhoneFieldDemo = ({
	srOnlyLabel,
	description,
	srOnlyDescription,
	disabled,
	required,
}: {
	srOnlyLabel?: boolean
	description?: string
	srOnlyDescription?: boolean
	disabled?: boolean
	required?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div className="max-w-[220px]">
			<Form formMethods={form} formName="Phone form" onSubmit={onSubmit}>
				<PhoneField
					id="phone"
					name="phone"
					control={form.control}
					label="Phone number"
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

const meta: Meta<typeof PhoneFieldDemo> = {
	title: 'Forms/Fields/PhoneField',
	render: ({ srOnlyLabel, description, srOnlyDescription, disabled, required }) => (
		<PhoneFieldDemo
			srOnlyLabel={srOnlyLabel}
			description={description}
			srOnlyDescription={srOnlyDescription}
			disabled={disabled}
			required={required}
		/>
	),
	args: {
		srOnlyLabel: false,
		description: 'Your phone number',
		srOnlyDescription: false,
		disabled: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		const phoneField = canvas.getByLabelText(/Phone number/i)
		await expect(phoneField).toBeInTheDocument()
		await expect(phoneField).toHaveAccessibleName()
		if (!args.disabled) {
			await userEvent.type(phoneField, '123  456')
			await expect(phoneField).toHaveValue('(123) 456')
			await userEvent.type(phoneField, '1234')
			await expect(phoneField).toHaveValue('(123) 456-1234')
		}
	},
}

export default meta

type Story = StoryObj<typeof PhoneFieldDemo>

export const Default: Story = {}
