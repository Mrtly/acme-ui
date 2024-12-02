import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '@/components/forms/inputs/Switch'
import { userEvent, within, expect } from '@storybook/test'

const meta: Meta<typeof Switch> = {
	title: 'Forms/Inputs/Switch',
	render: ({ ...args }) => (
		<Switch
			id="switch"
			label={args.label}
			disabled={args.disabled}
			readOnly={args.readOnly}
			error={args.error}
		/>
	),
	args: {
		label: 'Push notifications',
		disabled: false,
		readOnly: false,
		error: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const switchElement = canvas.getByRole('switch', { name: args.label })
		await expect(switchElement).toBeInTheDocument()
		await expect(switchElement).toHaveAccessibleName()
		expect(switchElement).not.toBeChecked()
		if (args.disabled) {
			await expect(switchElement).toBeDisabled()
		} else if (args.readOnly) {
			await expect(switchElement).toHaveAttribute('aria-readonly', 'true')
		} else {
			expect(switchElement).not.toBeDisabled()
			await userEvent.click(switchElement)
			await expect(switchElement).toBeChecked()
			switchElement.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof Switch>

export const Default: Story = {}
