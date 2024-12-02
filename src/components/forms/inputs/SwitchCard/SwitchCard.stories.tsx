import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SwitchCard, SwitchCardProps } from './SwitchCard'
import { userEvent, within, expect } from '@storybook/test'

const SwitchCardDemo = ({ args }: { args: SwitchCardProps }) => {
	return (
		<SwitchCard
			id="SwitchCard"
			label={args.label}
			statusLabelTrue={args.statusLabelTrue}
			statusLabelFalse={args.statusLabelFalse}
			disabled={args.disabled}
			readOnly={args.readOnly}
			error={args.error}
		>
			{args.children}
		</SwitchCard>
	)
}

const meta: Meta<typeof SwitchCard> = {
	title: 'Forms/Inputs/SwitchCard',
	render: ({ ...args }) => (
		<div className="max-w-sm">
			<SwitchCardDemo args={args} />
		</div>
	),
	args: {
		label: 'Paperless',
		statusLabelTrue: 'Enrolled',
		statusLabelFalse: 'Not Enrolled',
		disabled: false,
		readOnly: false,
		error: false,
		children: 'Our Paperless Billing option decreases clutter and helps the environment.',
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const switchElement = canvas.getByRole('switch', { name: /Paperless/i })
		await expect(switchElement).toBeInTheDocument()
		await expect(switchElement).toHaveAccessibleName()
		args.children && (await expect(switchElement).toHaveAccessibleDescription())

		//not checked
		expect(switchElement).not.toBeChecked()
		const status = canvas.getByTestId('switchcard-status')
		await expect(status).toHaveTextContent(`${args.statusLabelFalse}`)

		await userEvent.click(switchElement)
		//not checked
		await expect(switchElement).toBeChecked()
		await expect(status).toHaveTextContent(`${args.statusLabelTrue}`)
	},
}

export default meta

type Story = StoryObj<typeof SwitchCard>

export const Default: Story = {}
