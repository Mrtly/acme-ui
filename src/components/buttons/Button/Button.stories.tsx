import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/buttons/Button'
import { userEvent, fireEvent, within, expect } from '@storybook/test'

const meta: Meta<typeof Button> = {
	title: 'Buttons/Button',
	render: ({ variant, size, disabled, busy, busyMsg, isFullWidth }) => (
		<Button
			variant={variant}
			size={size}
			disabled={disabled}
			busy={busy}
			busyMsg={busyMsg}
			isFullWidth={isFullWidth}
		>
			Submit
		</Button>
	),
	args: {
		variant: 'primary',
		size: 'md',
		disabled: false,
		busy: false,
		busyMsg: '',
		isFullWidth: false,
	},
	argTypes: {
		variant: {
			options: ['primary', 'secondary', 'destructive', 'ghost', 'action'],
			control: {
				type: 'select',
			},
		},
		size: {
			options: ['sm', 'md', 'lg', 'xl'],
			control: {
				type: 'select',
			},
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		if (canvas.queryByRole('button', { name: 'Add' })) {
			return
		} //do not run for WithIcons story

		if (args.disabled) {
			const button = canvas.getByRole('button') as HTMLButtonElement
			await expect(button).toBeDisabled()
		} else if (args.busy) {
			const button = canvas.getByRole('button') as HTMLButtonElement
			expect(button).not.toBeDisabled()
			await expect(button).toHaveAttribute('data-busy', 'true')
			await expect(button).toHaveAccessibleName()
			if (args.variant !== 'action') {
				const loadingIndicator = within(button).getByTestId('loading-indicator')
				await expect(loadingIndicator).toBeVisible()
			}
			if (args.busyMsg && args.variant !== 'action') {
				await expect(button).toHaveTextContent(args.busyMsg)
			}
		} else {
			const button = canvas.getByRole('button') as HTMLButtonElement
			expect(button).not.toBeDisabled()
			await expect(button).toHaveAccessibleName()
			await userEvent.type(button, '{Enter}')
			await userEvent.click(button)
			switch (args.variant) {
				case 'primary':
					await expect(button.className).toContain('bg-brand text-white')
					break
				case 'secondary':
					await expect(button.className).toContain('bg-white text-gray-600')
					break
				case 'destructive':
					await expect(button.className).toContain('bg-error text-white')
					break
				case 'action':
					await expect(button.className).toContain('text-brand')
					break
				default:
					break
			}
			expect(button).not.toBeDisabled()
			fireEvent.mouseEnter(button)
			switch (args.variant) {
				case 'primary':
					await expect(button.className).toContain('bg-brand')
					break
				case 'secondary':
					await expect(button.className).toContain('bg-gray-100')
					break
				case 'destructive':
					await expect(button.className).toContain('bg-red-800')
					break
				case 'ghost':
					await expect(button.className).toContain('bg-gray-100')
					break
				case 'action':
					await expect(button.className).toContain('text-blue-800')
					break
				default:
					break
			}
			await expect(button).toHaveStyle('cursor:pointer')
			button.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}

export const WithIcons = {
	title: 'Buttons/Button',
	render: ({ ...args }) => (
		<div className="flex flex-col gap-4 items-start">
			<Button
				variant={args.variant}
				size={args.size}
				iconName="Plus"
				iconPosition="right"
				busy={args.busy}
				disabled={args.disabled}
				isFullWidth={args.isFullWidth}
			>
				Add
			</Button>
			<Button
				variant={args.variant}
				size={args.size}
				iconName="Edit"
				iconPosition="left"
				busy={args.busy}
				disabled={args.disabled}
				isFullWidth={args.isFullWidth}
			>
				Edit
			</Button>
		</div>
	),
	args: {
		variant: 'primary',
		size: 'md',
		isFullWidth: false,
	},
	argTypes: {
		variant: {
			options: ['primary', 'secondary', 'destructive', 'ghost', 'action'],
			control: {
				type: 'select',
			},
		},
		size: {
			options: ['sm', 'md', 'lg', 'xl'],
			control: {
				type: 'select',
			},
		},
	},
	// @ts-expect-error implicit any type
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		if (!canvas.queryByRole('button', { name: 'Add' })) {
			return
		} //only run for WithIcons story
		const addBtn = canvas.getByRole('button', { name: 'Add' })
		await expect(addBtn).toBeInTheDocument()
		await expect(addBtn).toHaveAccessibleName()
		const plusIcon = within(addBtn).getByTestId('Plus-icon-right')
		await expect(plusIcon).toBeInTheDocument()
		await expect(plusIcon).toBeVisible()

		const editBtn = canvas.getByRole('button', { name: 'Edit' })
		await expect(editBtn).toBeInTheDocument()
		await expect(editBtn).toHaveAccessibleName()
		const editIcon = within(editBtn).getByTestId('Edit-icon-left')
		await expect(editIcon).toBeInTheDocument()
		await expect(editIcon).toBeVisible()
	},
}
