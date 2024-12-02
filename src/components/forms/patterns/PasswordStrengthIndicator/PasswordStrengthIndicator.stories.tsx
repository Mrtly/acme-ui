import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from '@storybook/test'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/buttons/Button'
import { Form } from '@/forms/Form'
import {
	PasswordField,
	PasswordFieldSchemaForStrengthIndicator,
} from '@/forms/fields/PasswordField'
import { strengthScale, PasswordStrengthIndicator } from './PasswordStrengthIndicator'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'

const PasswordFieldFormSchema = z.object({
	password: PasswordFieldSchemaForStrengthIndicator,
})

const SingleFieldDemo = () => {
	const form = useForm<z.infer<typeof PasswordFieldFormSchema>>({
		resolver: zodResolver(PasswordFieldFormSchema),
	})

	const onSubmit = (data: z.infer<typeof PasswordFieldFormSchema>) => {
		addToastToQueue({
			title: 'You submitted the following values:',
			description: <JsonCodeBlockDisplay data={data} />,
		})
	}

	return (
		<div className="max-w-sm">
			<Form
				formMethods={form}
				formName="Create password form"
				onSubmit={onSubmit}
				className="flex flex-col gap-4"
			>
				<PasswordField
					id="password"
					name="password"
					label="Create Password"
					control={form.control}
					autoComplete="current-password"
					isCreateOrChangeField
				/>

				<PasswordStrengthIndicator password={form.watch('password')} />

				<Button type="submit">Submit</Button>
			</Form>

			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof SingleFieldDemo> = {
	title: 'Forms/Patterns/PasswordStrengthIndicator',
	render: () => <SingleFieldDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		//only run these tests for the single input story
		if (canvas.queryByLabelText('Confirm password')) {
			return
		}

		// Array of test cases for different password inputs and their expected strength labels
		const testCases = [
			{ input: '', expected: strengthScale[0].name },
			{ input: 'x', expected: strengthScale[1].name },
			{ input: 'weak', expected: strengthScale[1].name },
			{ input: 'Moderate', expected: strengthScale[2].name },
			{ input: 'Good1Pass', expected: strengthScale[3].name },
			{ input: 'Str0ng@Pass', expected: strengthScale[4].name },
			{ input: 'Excell3nt@Pass!', expected: strengthScale[5].name },
		]

		const inputElement = canvas.getByLabelText('Create Password')
		const levelIndicators = canvas.getAllByTestId('level-indicator')
		for (const { input, expected } of testCases) {
			// Simulate user input
			await userEvent.clear(inputElement)
			if (input !== '') {
				await userEvent.type(inputElement, input)
			}

			// Assertions for each strength level
			await waitFor(() => {
				expect(canvas.getByText(`Password Strength: ${expected}`)).toBeInTheDocument()
			})

			if (expected === strengthScale[0].name)
				levelIndicators.map((indicator) => {
					expect(indicator).toHaveClass(strengthScale[0].color)
				})
			if (expected === strengthScale[1].name)
				levelIndicators.map((indicator, indicatorNumber) => {
					const isFirstOne = indicatorNumber === 0
					if (isFirstOne) {
						expect(indicator).toHaveClass(strengthScale[1].color)
						return
					}
					expect(indicator).toHaveClass(strengthScale[0].color)
				})
			if (expected === strengthScale[2].name)
				levelIndicators.map((indicator, indicatorNumber) => {
					const isTwoIndicators = indicatorNumber <= 1
					if (isTwoIndicators) {
						expect(indicator).toHaveClass(strengthScale[2].color)
						return
					}
					expect(indicator).toHaveClass(strengthScale[0].color)
				})
			if (expected === strengthScale[3].name)
				levelIndicators.map((indicator, indicatorNumber) => {
					const isThreeIndicators = indicatorNumber <= 2
					if (isThreeIndicators) {
						expect(indicator).toHaveClass(strengthScale[3].color)
						return
					}
					expect(indicator).toHaveClass(strengthScale[0].color)
				})
			if (expected === strengthScale[4].name)
				levelIndicators.map((indicator, indicatorNumber) => {
					const isFourIndicators = indicatorNumber <= 3
					if (isFourIndicators) {
						expect(indicator).toHaveClass(strengthScale[4].color)
						return
					}
					expect(indicator).toHaveClass(strengthScale[0].color)
				})
			if (expected === strengthScale[5].name)
				levelIndicators.map((indicator, indicatorNumber) => {
					const isFiveIndicators = indicatorNumber <= 4
					if (isFiveIndicators) {
						expect(indicator).toHaveClass(strengthScale[5].color)
						return
					}
					expect(indicator).toHaveClass(strengthScale[0].color)
				})
		}
		await userEvent.clear(inputElement)

		await userEvent.type(inputElement, 'Excell3nt@Pass!')
		const submit = canvas.getByRole('button', { name: 'Submit' })
		await userEvent.click(submit)
	},
}

export default meta
export const Default: StoryObj = {}
