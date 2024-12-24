import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarImage, AvatarFallback } from 'src/utility/Avatar'

const meta: Meta<typeof Avatar> = {
	title: 'Utility/Avatar',
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="sample avatar" />
			<AvatarFallback>{/* <User /> */}</AvatarFallback>
		</Avatar>
	),
}

export default meta

type Story = StoryObj<typeof Avatar>

export const Default: Story = {}
