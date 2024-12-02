import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@/components/forms/inputs/elements/Label'
import { within, expect } from '@storybook/test'

const meta: Meta<typeof Label> = {
	title: 'Forms/Inputs/Elements/Label',
	render: ({ srOnly }) => (
		<div className="max-w-sm">
			<Label htmlFor="name" srOnly={srOnly}>
				First name
			</Label>
		</div>
	),
	args: { srOnly: false },
	parameters: {
		controls: {
			exclude: 'asChild',
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		if (args.srOnly) {
			const label = canvas.queryByText('First name')
			await expect(label).toBeInTheDocument()
			await expect(label).toHaveClass('sr-only')
		} else {
			const label = canvas.getByText('First name')
			await expect(label).toBeInTheDocument()
			await expect(label).toBeVisible()
			expect(label).not.toHaveClass('sr-only')
		}
	},
}

export default meta

type Story = StoryObj<typeof Label>

export const Default: Story = {}
