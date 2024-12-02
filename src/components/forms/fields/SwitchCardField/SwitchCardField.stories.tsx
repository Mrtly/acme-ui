import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SwitchCardField } from './SwitchCardField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { Button } from '@/components/buttons/Button'

import { userEvent, within, expect } from '@storybook/test'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'

const FormSchema = z.object({
	paperless: z.boolean().refine((v) => v === true, {
		message: 'Required.',
	}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const SwitchDemo = ({
	label,
	description,
	srOnlyDescription,
	disabled,
	readOnly,
	statusLabelTrue,
	statusLabelFalse,
}: {
	label: string
	description: string
	srOnlyDescription?: boolean
	error?: boolean
	disabled?: boolean
	readOnly?: boolean
	statusLabelTrue?: string
	statusLabelFalse?: string
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div className="max-w-sm">
			<Form formMethods={form} formName="switch form" onSubmit={onSubmit}>
				<SwitchCardField
					control={form.control}
					id="paperless"
					label={label}
					statusLabelTrue={statusLabelTrue}
					statusLabelFalse={statusLabelFalse}
					name="paperless"
					description={description}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
				/>
				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof SwitchDemo> = {
	title: 'Forms/Fields/SwitchCardField',
	render: ({ ...args }) => (
		<SwitchDemo
			label={args.label}
			error={args.error}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
			statusLabelTrue={args.statusLabelTrue}
			statusLabelFalse={args.statusLabelFalse}
		/>
	),
	args: {
		label: 'Paperless',
		statusLabelTrue: 'Enrolled',
		statusLabelFalse: 'Not Enrolled',
		disabled: false,
		readOnly: false,
		description: 'Our Paperless Billing option decreases clutter and helps the environment.',
		srOnlyDescription: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const switchElement = canvas.getByRole('switch', { name: /Paperless/i })
		expect(switchElement).toBeInTheDocument()
		expect(switchElement).toHaveAccessibleName()
		args.description && expect(switchElement).toHaveAccessibleDescription()

		//not checked
		expect(switchElement).not.toBeChecked()
		const status = canvas.getByTestId('switchcard-status')
		expect(status).toHaveTextContent(`${args.statusLabelFalse}`)

		await userEvent.click(switchElement, { delay: 50 })
		//not checked
		expect(switchElement).toBeChecked()
		expect(status).toHaveTextContent(`${args.statusLabelTrue}`)
	},
}

export default meta

type Story = StoryObj<typeof SwitchDemo>

export const Default: Story = {}
