import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { Button } from '@/components/buttons/Button'
import { CheckboxGroupField, CheckboxGroupFieldCard } from './CheckboxGroupField'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { expect, screen, userEvent, within } from '@storybook/test'
import { Checkbox } from '@/components/forms/inputs/Checkbox'

// import { screen, userEvent, within, expect } from '@storybook/test'

const FormSchema = z.object({
	checkbox_group: z
		// z can be enum if options are known z.array(z.enum(['one', 'two', 'three'])),
		.array(z.string(), {
			message: 'Select addresses.',
		})
		.min(1, {
			message: 'Select addresses.',
		}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const CheckboxGroupFieldDemo = ({
	srOnlyLabel,
	srOnlyDescription,
	disabled,
	readOnly,
	required,
}: {
	srOnlyLabel?: boolean
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	const allAddresses = [
		'222 Main Road, Apt 1 Emmaus, PA 18049',
		'222 Main Road, Apt 2 Emmaus, PA 18049',
		'222 Main Road, Apt 3 Emmaus, PA 18049',
	]
	function selectAll(v: boolean) {
		form.setValue('checkbox_group', v ? allAddresses : [])
	}

	return (
		<div className="flex flex-col gap-6 w-1/2">
			<Checkbox onChange={selectAll} id="all" label="Select all" value="all" className="self-end" />
			<Form formMethods={form} formName="checkbox form" onSubmit={onSubmit}>
				<CheckboxGroupField
					control={form.control}
					name="checkbox_group"
					label="Select your service address"
					description="You can select one or more addresses"
					srOnlyLabel={srOnlyLabel}
					srOnlyDescription={srOnlyDescription}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
				>
					{allAddresses.map((a) => (
						<CheckboxGroupFieldCard
							key={a}
							id={a}
							label={a}
							value={a}
							description={<>19920-06015 | Gas</>}
							rowReverse
							colReverse
						/>
					))}
				</CheckboxGroupField>
				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof CheckboxGroupFieldDemo> = {
	title: 'Forms/Fields/CheckboxGroupField',
	render: ({ ...args }) => (
		<CheckboxGroupFieldDemo
			srOnlyLabel={args.srOnlyLabel}
			srOnlyDescription={args.srOnlyDescription}
			disabled={args.disabled}
			readOnly={args.readOnly}
			required={args.required}
		/>
	),
	args: {
		srOnlyLabel: false,
		srOnlyDescription: false,
		disabled: false,
		readOnly: false,
		required: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const checkboxGroup = canvas.getByRole('group', {
			name: 'Select your service address',
		})
		expect(checkboxGroup).toBeInTheDocument()
		expect(checkboxGroup).toHaveAccessibleName()

		const submit = canvas.getByRole('button', { name: 'Submit' })
		await userEvent.click(submit, { delay: 50 })

		expect(checkboxGroup).toHaveAttribute('data-invalid', 'true')
		expect(canvas.getByText('Select addresses.')).toBeInTheDocument()

		const apt1 = canvas.getByLabelText(/Apt 1/i)
		await userEvent.click(apt1)

		const apt2 = canvas.getByLabelText(/Apt 2/i)
		await userEvent.click(apt2)

		await userEvent.click(submit)
		expect(checkboxGroup).not.toHaveAttribute('data-invalid')
		expect(
			screen.getByRole('alertdialog', {
				name: 'You submitted the following values:',
			})
		).toBeVisible()
		const dismissToast = screen.getByRole('button', { name: 'Dismiss' })
		await userEvent.click(dismissToast)
	},
}

export default meta

type Story = StoryObj<typeof CheckboxGroupFieldDemo>

export const Default: Story = {}
