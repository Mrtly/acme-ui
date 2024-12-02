import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	ModalDialog,
	ModalDialogTrigger,
	ModalDialogContent,
	ModalDialogHeader,
	ModalDialogFooter,
	ModalDialogTitle,
	ModalDialogDescription,
	ModalDialogClose,
} from './ModalDialog'
import { Button } from '@/components/buttons/Button'
import { TextInput } from '@/components/forms/inputs/TextInput'
import { screen, userEvent, waitFor, within, expect } from '@storybook/test'

const meta: Meta = {
	title: 'Dialogs/ModalDialog',
	render: ({ ...args }) => (
		<ModalDialog>
			<ModalDialogTrigger asChild>
				<Button variant="secondary">Edit Profile</Button>
			</ModalDialogTrigger>
			<ModalDialogContent className="sm:max-w-[425px]" showCloseButton={args.showCloseButton}>
				<ModalDialogHeader>
					<ModalDialogTitle>Edit profile</ModalDialogTitle>
					<ModalDialogDescription>
						{`Make changes to your profile here. Click save when you're done.`}
					</ModalDialogDescription>
				</ModalDialogHeader>
				<div className="grid gap-4 py-4">
					<TextInput
						id="name"
						name="name"
						label="Name"
						defaultValue="Pedro Duarte"
						className="col-span-3"
					/>
					<TextInput
						id="username"
						name="username"
						label="Username"
						defaultValue="@peduarte"
						className="col-span-3"
					/>
				</div>
				<ModalDialogFooter>
					<ModalDialogClose asChild>
						<Button type="submit">Save changes</Button>
					</ModalDialogClose>
				</ModalDialogFooter>
			</ModalDialogContent>
		</ModalDialog>
	),
	args: {
		showCloseButton: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const showBtn = canvas.getByRole('button', { name: 'Edit Profile' })
		await expect(showBtn).toHaveAccessibleName()
		await userEvent.click(showBtn)
		await waitFor(async () => {
			const dialog = screen.getByRole('dialog')
			await expect(dialog).toBeVisible()
		})
		const dialog = screen.getByRole('dialog')
		const close = within(dialog).getByRole('button', { name: 'Close' })
		await expect(close).toHaveAccessibleName()
		const save = within(dialog).getByRole('button', { name: 'Save changes' })
		await expect(save).toHaveAccessibleName()
		await userEvent.click(close)
		await waitFor(async () => {
			expect(dialog).not.toBeVisible()
		})
		await userEvent.keyboard('{Tab}') //take focus off the button
	},
}

export default meta

type Story = StoryObj<typeof ModalDialog>

export const Default: Story = {}
