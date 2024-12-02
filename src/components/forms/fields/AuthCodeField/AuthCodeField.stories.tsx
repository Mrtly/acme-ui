import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Form } from '@/forms/Form'
import { AuthCodeField, AuthCodeFieldSchema } from './AuthCodeField'
import { within, expect, userEvent } from '@storybook/test'
import { Button } from '@/components/buttons/Button'

const FormSchema = z.object({
	verification_code: AuthCodeFieldSchema,
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const AuthCodeFieldDemo = ({
	description,
	srOnlyDescription,
	srOnlyLabel,
}: {
	description: string
	srOnlyDescription?: boolean
	srOnlyLabel?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	//for auto-submit:
	// const code = form.watch('verification_code')
	// useEffect(() => {
	// 	if (code?.length === 6) {
	// 		form.handleSubmit(onSubmit)()
	// 	}
	// }, [code, form])

	return (
		<div>
			<Form
				formMethods={form}
				formName="6-digit input form"
				onSubmit={onSubmit}
				className="flex flex-col gap-6"
			>
				<AuthCodeField
					control={form.control}
					id="verification-code"
					name="verification_code"
					description={description}
					srOnlyDescription={srOnlyDescription}
					srOnlyLabel={srOnlyLabel}
				/>
				<Button type="submit">Submit</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof AuthCodeFieldDemo> = {
	title: 'Forms/Fields/AuthCodeField',
	render: ({ ...args }) => (
		<AuthCodeFieldDemo
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			srOnlyLabel={args.srOnlyLabel}
		/>
	),
	args: {
		srOnlyLabel: false,
		srOnlyDescription: true,
		description: 'Enter the 6-digit code sent to your phone',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const input = canvas.getByLabelText('Verification code')
		expect(input).toBeInTheDocument()
		expect(input).toHaveAccessibleName()
		expect(input).toHaveAttribute('maxLength', '6')
		expect(input).toHaveAttribute('inputmode', 'numeric')
		expect(input).toHaveAttribute('required')
		expect(input).toHaveAttribute('autocomplete', 'one-time-code')
		args.description && expect(input).toHaveAccessibleDescription()
		await userEvent.type(input, '1', { delay: 50 })
		await userEvent.type(input, '2', { delay: 50 })
		await userEvent.type(input, '3', { delay: 50 })
		await userEvent.type(input, '4', { delay: 50 })
		await userEvent.type(input, '5', { delay: 50 })
		await userEvent.type(input, '6', { delay: 50 })
		expect(input).toHaveValue('123456')
	},
}

export default meta

type Story = StoryObj<typeof AuthCodeFieldDemo>

export const Default: Story = {}
