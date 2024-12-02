import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SwitchField } from '@/forms/fields/SwitchField'
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
}: {
	label: string
	description: string
	srOnlyDescription?: boolean
	error?: boolean
	disabled?: boolean
	readOnly?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div className="">
			<Form formMethods={form} formName="switch form" onSubmit={onSubmit}>
				<SwitchField
					control={form.control}
					id="paperless"
					label={label}
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
	title: 'Forms/Fields/SwitchField',
	render: ({ ...args }) => (
		<SwitchDemo
			label={args.label}
			error={args.error}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
		/>
	),
	args: {
		label: 'Go paperless',
		description: 'Opt out of paper mail and access your documents online.',
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const switchfield = canvas.getByLabelText(args.label)
		expect(switchfield).toHaveAttribute('role', 'switch')
		expect(switchfield).toBeVisible()
		expect(switchfield).toHaveAccessibleName()
		if (args.description) {
			expect(switchfield).toHaveAccessibleDescription()
		}

		expect(canvas.getByText(args.label)).toBeVisible()
		expect(switchfield).not.toBeChecked()
		if (args.disabled) {
			expect(switchfield).toBeDisabled()
		} else if (args.readOnly) {
			expect(switchfield).toHaveAttribute('aria-readonly', 'true')
		} else {
			expect(switchfield).not.toBeDisabled()
			expect(switchfield).not.toHaveAttribute('aria-readonly', 'true')

			await userEvent.click(switchfield)
			expect(switchfield).toBeChecked()
			//submit
			// const submit = canvas.getByRole('button', { name: 'Submit' })
			// await userEvent.click(submit)
			// expect(
			// 	screen.getByRole('alertdialog', {
			// 		name: 'You submitted the following values:',
			// 	})
			// ).toBeVisible()
			// const dismissToast = screen.getByRole('button', { name: 'Dismiss' })
			// await userEvent.click(dismissToast)
		}
	},
}

export default meta

type Story = StoryObj<typeof SwitchDemo>

export const Default: Story = {}
