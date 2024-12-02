import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DrawerDialog, DrawerDialogTrigger, DrawerDialogContent } from './DrawerDialog'
import { Button } from '@/components/buttons/Button'
import { screen, userEvent, waitFor, within, expect } from '@storybook/test'

const meta: Meta<typeof DrawerDialog> = {
	title: 'Dialogs/DrawerDialog',
	render: () => (
		<DrawerDialog>
			<DrawerDialogTrigger asChild>
				<Button>Open</Button>
			</DrawerDialogTrigger>
			<DrawerDialogContent
				title="Are you absolutely sure?"
				description="This action cannot be undone. This will permanently delete your
      account and remove your data from our servers."
			>
				main content here
			</DrawerDialogContent>
		</DrawerDialog>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const openBtn = canvas.getByRole('button', { name: 'Open' })
		await userEvent.click(openBtn)
		const dialog = screen.getByRole('dialog')
		await waitFor(() => expect(dialog).toBeVisible())
		await expect(dialog).toHaveAccessibleName()
		await expect(dialog).toHaveAccessibleDescription()
		const closeBtn = within(dialog).getByRole('button', { name: 'Close' })
		await userEvent.click(closeBtn)
		await waitFor(() => expect(dialog).not.toBeVisible())
	},
}

export default meta

type Story = StoryObj<typeof DrawerDialog>

export const Default: Story = {}

export const WithScrollableContent: Meta<typeof DrawerDialog> = {
	title: 'Dialogs/Drawer Dialog',
	render: () => (
		<DrawerDialog>
			<DrawerDialogTrigger asChild>
				<Button>Open</Button>
			</DrawerDialogTrigger>
			<DrawerDialogContent
				title={
					<>
						<span className="sr-only">scrollable menu</span>
					</>
				}
				description="Dialog with scrollable content"
			>
				<div className="flex flex-col gap-12">
					<div>scrollable content here</div>
					<div>scrollable content here</div>
					<div>scrollable content here</div>
					<div>scrollable content here</div>
					<div>scrollable content here</div>
					<div>scrollable content here</div>
					<div>scrollable content here</div>
					<div>scrollable content here</div>
					<div>scrollable content here</div>
				</div>
			</DrawerDialogContent>
		</DrawerDialog>
	),
}
