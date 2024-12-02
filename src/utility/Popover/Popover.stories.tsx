import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/utility/Popover'
import { Button } from '@/components/buttons/Button'
import { screen, userEvent, waitFor, within, expect } from '@storybook/test'

const meta: Meta<typeof Popover> = {
	title: 'Utility/Popover',
	render: () => (
		<Popover>
			<PopoverTrigger asChild>
				<Button>Open</Button>
			</PopoverTrigger>
			<PopoverContent>Place content for the popover here.</PopoverContent>
		</Popover>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const button = canvas.getByRole('button', { name: 'Open' })
		await userEvent.click(button)
		await waitFor(async () => {
			const popover = await screen.findByRole('dialog')
			await expect(popover).toBeInTheDocument()
			await expect(popover).toBeVisible()
			await expect(popover).toHaveAttribute('data-state', 'open')
			await expect(popover).toHaveTextContent('Place content for the popover here.')
		})
	},
}

export default meta

type Story = StoryObj<typeof Popover>

export const Default: Story = {}
