import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config'
import { ColorSwatchGroup, groupColorsIntoLists } from './ColorSwatch'
import { GlobalToastRegion } from '@/components/notifications/Toast'

//import theme colors from tailwind config
const { theme } = resolveConfig(tailwindConfig)
const themeColors = theme?.colors

// @ts-expect-error messy color types wip
const displayColorsList = groupColorsIntoLists(themeColors)

const ColorsDemo = () => {
	return (
		<div className="pb-10">
			<h1 className="text-xl py-4">Colors (default Tailwind palette)</h1>
			<div className="w-3/4 mx-auto flex flex-col gap-4">
				{displayColorsList.map((colors, i) => (
					<ColorSwatchGroup colors={colors} key={i} />
				))}

				<GlobalToastRegion />
			</div>
		</div>
	)
}

const meta: Meta<typeof ColorsDemo> = {
	title: 'Theme/Colors',
	render: () => <ColorsDemo />,
}

export default meta

type Story = StoryObj<typeof ColorsDemo>

export const Default: Story = {}
