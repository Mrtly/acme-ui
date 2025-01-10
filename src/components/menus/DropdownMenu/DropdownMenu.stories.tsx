import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from './DropdownMenu'
import { Button } from '@/components/buttons/Button'
import { screen, userEvent, waitFor, within, expect } from '@storybook/test'

const meta: Meta<typeof DropdownMenu> = {
	title: 'Menus/DropdownMenu',
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button>Open</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Billing</DropdownMenuItem>
				<DropdownMenuItem>Team</DropdownMenuItem>
				<DropdownMenuItem>Subscription</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const trigger = canvas.getByRole('button', { name: 'Open' })
		await userEvent.click(trigger)
		const menu = screen.getByRole('menu')
		await waitFor(async () => {
			await expect(menu).toBeVisible()
		})
		await expect(menu).toHaveAccessibleName()
		await expect(menu).toHaveAttribute('data-state', 'open')
		const items = screen.getAllByRole('menuitem')
		items.forEach((item) => expect(item).toBeVisible())
		await userEvent.click(items[1])
		await expect(menu).toHaveAttribute('data-state', 'closed')
		await waitFor(async () => {
			expect(menu).not.toBeVisible()
		})
		await userEvent.keyboard('{Tab}') //take focus off the button
	},
}

export default meta

type Story = StoryObj<typeof DropdownMenu>

export const Default: Story = {}
