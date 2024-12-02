import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from '.'

const meta: Meta<typeof Separator> = {
	title: 'Utility/Separator',
	render: () => (
		<div>
			<div>
				<h4 className="text-sm">A UI component library.</h4>
			</div>
			<Separator className="my-4" />
			<div className="flex h-5 items-center gap-4 text-sm">
				<div>Blog</div>
				<Separator orientation="vertical" />
				<div>Docs</div>
				<Separator orientation="vertical" />
				<div>Source</div>
			</div>
		</div>
	),
}

export default meta

type Story = StoryObj<typeof Separator>

export const Default: Story = {}
