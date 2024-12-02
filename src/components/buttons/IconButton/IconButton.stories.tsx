import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './IconButton'
import { expect, fireEvent, userEvent, within } from '@storybook/test'

const meta: Meta<typeof IconButton> = {
	title: 'Buttons/IconButton',
	render: ({ variant, size, disabled, busy }) => (
		<IconButton
			variant={variant}
			size={size}
			disabled={disabled}
			busy={busy}
			ariaLabel="Chevron Right"
			iconName="ChevronRight"
		/>
	),
	args: {
		variant: 'primary',
		size: 'md',
		disabled: false,
		busy: false,
	},
	argTypes: {
		variant: {
			options: ['primary', 'secondary', 'destructive', 'ghost'],
			control: {
				type: 'select',
			},
		},
		size: {
			options: ['xs', 'sm', 'md', 'lg', 'xl'],
			control: {
				type: 'select',
			},
		},
	},
	parameters: {
		controls: {
			exclude: ['ariaLabel', 'icon'],
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		if (args.disabled) {
			const button = canvas.getByRole('button') as HTMLButtonElement
			await expect(button).toBeDisabled()
		} else if (args.busy) {
			const button = canvas.getByRole('button') as HTMLButtonElement
			expect(button).not.toBeDisabled()
			await expect(button).toHaveAttribute('data-busy', 'true')
			await expect(button).toHaveAccessibleName()
			const loadingIndicator = within(button).getByTestId('loading-indicator')
			await expect(loadingIndicator).toBeVisible()
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
				default:
					break
			}
			await expect(button).toHaveStyle('cursor:pointer')
			button.blur()
		}
	},
}

export default meta

type Story = StoryObj<typeof IconButton>

export const Default: Story = {}
