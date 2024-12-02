import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MaskedInput } from '@/components/forms/inputs/MaskedInput'
import { Separator } from '../../../../utility/Separator'
import { userEvent, within, expect } from '@storybook/test'

const meta: Meta<typeof MaskedInput> = {
	title: 'Forms/Inputs/MaskedInput',
	render: ({ ...args }) => (
		<div className="max-w-[180px] flex flex-col gap-4">
			<MaskedInput
				id="account-number"
				label="Account number"
				maskType="account"
				required={args.required}
				disabled={args.disabled}
				readOnly={args.readOnly}
				showOptional={args.showOptional}
			/>

			<Separator />

			<MaskedInput
				id="phone-number"
				label="Phone number"
				maskType="phone"
				required={args.required}
				disabled={args.disabled}
				readOnly={args.readOnly}
				showOptional={args.showOptional}
			/>

			<Separator />

			<MaskedInput
				id="zip"
				label="ZIP code"
				maskType="zip"
				required={args.required}
				disabled={args.disabled}
				readOnly={args.readOnly}
				showOptional={args.showOptional}
			/>

			<Separator />

			<MaskedInput
				id="usd"
				label="Dollar amount"
				maskType="usd"
				required={args.required}
				disabled={args.disabled}
				readOnly={args.readOnly}
				showOptional={args.showOptional}
			/>
		</div>
	),
	args: {
		required: true,
		showOptional: false,
		disabled: false,
		readOnly: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const accField = canvas.getByLabelText(/Account number/i)
		await expect(accField).toBeInTheDocument()
		await expect(accField).toHaveAccessibleName()
		if (args.required) {
			expect(canvas.queryByText('(optional)')).not.toBeInTheDocument()
			await expect(accField).toBeRequired()
		} else if (!args.required) {
			await expect(canvas.getAllByText('(optional)')[0]).toBeInTheDocument()
			expect(accField).not.toBeRequired()
		}

		if (!args.disabled && !args.readOnly) {
			await userEvent.type(accField, '1234 5678 9100 abcd')
			await expect(accField).toHaveValue('1234-5678-9100')
			await userEvent.type(accField, '1234')
			await expect(accField).toHaveValue('1234-5678-9100-1234')
		}

		const phoneField = canvas.getByLabelText(/Phone number/i)
		await expect(phoneField).toBeInTheDocument()
		await expect(phoneField).toHaveAccessibleName()
		if (!args.disabled && !args.readOnly) {
			await userEvent.type(phoneField, '123  456')
			await expect(phoneField).toHaveValue('(123) 456')
			await userEvent.type(phoneField, '1234')
			await expect(phoneField).toHaveValue('(123) 456-1234')
		}

		const zipField = canvas.getByLabelText(/ZIP code/i)
		await expect(zipField).toBeInTheDocument()
		await expect(zipField).toHaveAccessibleName()
		if (!args.disabled && !args.readOnly) {
			await userEvent.type(zipField, '1234')
			zipField.focus()
			await userEvent.keyboard('a')
			await expect(zipField).toHaveValue('1234')
			await userEvent.keyboard('5')
			await expect(zipField).toHaveValue('12345')
		}

		const usdField = canvas.getByLabelText(/Dollar amount/i)
		await expect(usdField).toBeInTheDocument()
		await expect(usdField).toHaveAccessibleName()
		if (!args.disabled && !args.readOnly) {
			await userEvent.type(usdField, '1234')
			usdField.focus()
			await userEvent.keyboard('a')
			await expect(usdField).toHaveValue('12.34')
			await userEvent.keyboard('5')
			await expect(usdField).toHaveValue('123.45')
			await userEvent.keyboard('678')
			await expect(usdField).toHaveValue('123,456.78')
			await userEvent.keyboard('9')
			await expect(usdField).toHaveValue('1,234,567.89')
		}

		usdField.blur()
	},
}

export default meta

type Story = StoryObj<typeof MaskedInput>

export const Default: Story = {}
