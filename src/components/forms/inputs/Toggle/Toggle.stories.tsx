import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Toggle } from '@/components/forms/inputs/Toggle'
import { userEvent, within, expect } from '@storybook/test'
import { Icon } from '@/theme/Icons'

const ToggleDemo = () => {
	return (
		<div className="max-w-sm">
			<Toggle
				aria-label="Toggle flag"
				className="size-10"
				onChange={() => {
					console.log('toggled')
				}}
			>
				<Icon name="Bookmark" size="md" />
			</Toggle>
		</div>
	)
}

const meta: Meta<typeof ToggleDemo> = {
	title: 'Forms/Inputs/Toggle',
	render: () => <ToggleDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const toggle = canvas.getByRole('button', { name: 'Toggle flag' })
		expect(toggle).toBeInTheDocument()
		expect(toggle).toBeVisible()
		expect(toggle).toHaveAccessibleName()
		expect(toggle).toHaveAttribute('aria-pressed', 'false')
		await userEvent.click(toggle)
		expect(toggle).toHaveAttribute('aria-pressed', 'true')
	},
}

export default meta

type Story = StoryObj<typeof ToggleDemo>

export const Default: Story = {}
