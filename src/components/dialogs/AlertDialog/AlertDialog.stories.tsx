import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from './AlertDialog'
import { Button } from '@/components/buttons/Button'
import { userEvent, within, screen, waitFor, expect } from '@storybook/test'

const meta: Meta<typeof AlertDialog> = {
	title: 'Dialogs/AlertDialog',
	render: () => (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="secondary">Show Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
		const showButton = canvas.getByRole('button', { name: 'Show Dialog' })
		await userEvent.click(showButton)
		await expect(screen.getByRole('alertdialog')).toBeInTheDocument()
		await expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument()
		const cancelButton = screen.getByRole('button', { name: 'Cancel' })
		await userEvent.click(cancelButton)
		await waitFor(() => {
			expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
		})
		await userEvent.keyboard('{Tab}') //take focus off the button
	},
}

export default meta

type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {}
