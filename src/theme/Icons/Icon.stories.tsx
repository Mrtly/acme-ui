import React, { ReactNode, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Separator } from '../../utility/Separator'
import { SearchBar } from '@/components/forms/inputs/elements/SearchBar'
import { RadioGroup, Radio } from '@/components/forms/inputs/RadioGroup'
import { Icon, FeatherIconName, featherIconNames } from './Icon'

const IconsDemoWrapper = ({ children, label }: { children: ReactNode; label: string }) => {
	return (
		<div className="border rounded-lg w-40 h-32 flex flex-col items-center justify-center py-4">
			<div className="text-6xl flex items-center justify-center grow">{children}</div>
			<div>{label}</div>
		</div>
	)
}

const IconsDemo = () => {
	const [searchValue, setSearchValue] = useState('')

	const filteredIcons = featherIconNames.filter((name) =>
		name.toLowerCase().includes(searchValue.toLowerCase())
	)

	const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')

	return (
		<div className="w-full">
			<div className="mb-4 flex items-center justify-between">
				<SearchBar
					id="icons-search"
					label="Search Icons"
					srOnlyLabel
					placeholder="Search Icons"
					onValueChange={(e) => setSearchValue(e)}
					className="w-60"
				/>
				<RadioGroup
					name="icon-size"
					legend="size"
					orientation="horizontal"
					value={size}
					onChange={(s) => setSize(s as 'sm' | 'md' | 'lg' | 'xl')}
				>
					<Radio id="sm" value="sm" label="sm" />
					<Radio id="md" value="md" label="md" />
					<Radio id="lg" value="lg" label="lg" />
					<Radio id="xl" value="xl" label="xl" />
				</RadioGroup>
			</div>
			<Separator className="mb-5" />
			<div className="flex flex-wrap gap-4">
				{filteredIcons.map((name, index) => {
					return (
						<IconsDemoWrapper label={name} key={index}>
							<Icon name={name as FeatherIconName} size={size} />
						</IconsDemoWrapper>
					)
				})}
			</div>
		</div>
	)
}

const meta: Meta<typeof IconsDemo> = {
	title: 'Theme/Icons',
	render: () => <IconsDemo />,
}

export default meta

type Story = StoryObj<typeof IconsDemo>

export const AllIcons: Story = {}
