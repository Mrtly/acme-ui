import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { RadioCardGroupField, RadioCardGroupFieldItem } from '@/forms/fields/RadioCardGroupField'

import { userEvent, within, expect } from '@storybook/test'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'
import { CurrencyFormat } from '../../../../other/CurrencyFormat'
import { DateFormat } from '../../../../other/DateFormat'
import { Icon } from '@/theme/Icons'

const FormSchema = z.object({
	payment_amount: z.enum(['amount_due', 'account_balance', 'other_amount'], {
		required_error: 'Select payment amount.',
	}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

type FieldDemoProps = {
	legend: string
	description: string
	srOnlyLegend?: boolean
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
}

const RadioCardGroupFieldDemo = ({
	legend,
	description,
	srOnlyDescription,
	srOnlyLegend,
	disabled,
	readOnly,
	required,
}: FieldDemoProps) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div className="max-w-sm">
			<Form
				formMethods={form}
				formName="radio cards form"
				onSubmit={onSubmit}
				className="flex flex-col gap-9"
			>
				<RadioCardGroupField
					control={form.control}
					name="payment_amount"
					legend={legend}
					description={description}
					srOnlyDescription={srOnlyDescription}
					srOnlyLegend={srOnlyLegend}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
				>
					<RadioCardGroupFieldItem
						id="amount-due"
						label="Amount due"
						value="amount_due"
						description={
							<>
								Due on <DateFormat date={new Date()} />
							</>
						}
						rightSlot={<CurrencyFormat amount="140.25" />}
					/>
					<RadioCardGroupFieldItem
						id="account-balance"
						label="Account balance"
						value="account_balance"
						description="Your current outstanding balance"
						rightSlot={<CurrencyFormat amount="205.55" />}
					/>
					<RadioCardGroupFieldItem
						id="other-amount"
						label="Other service"
						value="other_amount"
						description="Other payments service"
						bottomSlot={
							<div className="flex gap-4">
								<Icon name="CreditCard" size="xl" className="text-brand" />
								<Icon name="CreditCard" size="xl" className="text-red-500" />
								<Icon name="CreditCard" size="xl" className="text-green-500" />
								<Icon name="CreditCard" size="xl" className="text-purple-500" />
							</div>
						}
					/>
				</RadioCardGroupField>
				<Button type="submit" className="mt-4" disabled={disabled}>
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof RadioCardGroupFieldDemo> = {
	title: 'Forms/Fields/RadioCardGroupField',
	render: ({ ...args }) => (
		<RadioCardGroupFieldDemo
			legend={args.legend}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			srOnlyLegend={args.srOnlyLegend}
			disabled={args.disabled}
			readOnly={args.readOnly}
			required={args.required}
		/>
	),
	args: {
		legend: 'Choose a payment amount',
		description: 'Praesent commodo cursus magna.',
		srOnlyDescription: false,
		srOnlyLegend: false,
		disabled: false,
		readOnly: false,
		required: true,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const radioCards = canvas.getByRole('radiogroup', { name: args.legend })
		expect(radioCards).toHaveAccessibleName()
		if (args.description) {
			expect(radioCards).toHaveAccessibleDescription()
		}
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			expect(radioCards).toBeRequired()
		} else if (!args.required) {
			expect(canvas.getByText('(optional)')).toBeInTheDocument()
			expect(radioCards).not.toBeRequired()
		}
		const radioOne = canvas.getByLabelText('Amount due')
		expect(radioOne).toHaveAccessibleName()
		expect(radioOne).toHaveAttribute('value', 'amount_due')
		expect(radioOne).not.toBeChecked()
		const radioTwo = canvas.getByLabelText('Account balance')
		expect(radioTwo).not.toBeChecked()
		if (args.disabled) {
			expect(radioTwo).toBeDisabled()
			expect(radioOne).toBeDisabled()
		} else {
			await userEvent.click(radioTwo)
			expect(radioTwo).toBeChecked()
			radioTwo.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof RadioCardGroupFieldDemo>

export const Default: Story = {}
