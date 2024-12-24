import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip, TooltipTrigger, TooltipContent } from 'src/utility/Tooltip'
import { screen, userEvent, waitFor, within, expect } from '@storybook/test'
import { Icon } from '@/theme/Icons'

const meta: Meta<typeof Tooltip> = {
	title: 'Utility/Tooltip',
	render: () => (
		<Tooltip>
			<TooltipTrigger aria-label="tooltip">
				<Icon name="PlusCircle" size="md" />
			</TooltipTrigger>
			<TooltipContent>
				<p>Add to library</p>
			</TooltipContent>
		</Tooltip>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'tooltip' })
		expect(trigger).toBeVisible()
		expect(trigger).toHaveAccessibleName()
		expect(trigger).toHaveAttribute('data-state', 'closed')
		await userEvent.hover(trigger)
		await waitFor(async () => {
			const content = screen.getByRole('tooltip', { name: 'Add to library' })
			expect(content).toBeVisible()
			expect(content).toHaveAccessibleName()
		})
	},
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {}
