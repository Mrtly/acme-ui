import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CheckboxGroup } from './CheckboxGroup'
import { Checkbox } from '../Checkbox'
import { CheckboxCard } from '../CheckboxCard'
import { Separator } from '../../../../utility/Separator'
import { userEvent, within, expect } from '@storybook/test'

const CheckboxGroupDemo = ({ srOnlyLabel }: { srOnlyLabel?: boolean }) => {
	const [selected, setSelected] = useState<string[]>(['Lettuce'])

	return (
		<div className="flex flex-col gap-4 w-1/2">
			<CheckboxGroup
				value={selected}
				onChange={setSelected}
				label="Sandwich condiments"
				srOnlyLabel={srOnlyLabel}
			>
				{['Lettuce', 'Tomato', 'Onion', 'Sprouts'].map((i) => {
					return <Checkbox key={i} label={i} id={i} value={i} />
				})}
			</CheckboxGroup>
			<Separator />
			<div className="text-gray-500">
				<div className="font-medium">group value:</div>
				{JSON.stringify(selected)}
			</div>
		</div>
	)
}

const meta: Meta<typeof CheckboxGroup> = {
	title: 'Forms/Inputs/CheckboxGroup',
	render: ({ ...args }) => <CheckboxGroupDemo srOnlyLabel={args.srOnlyLabel} />,
	args: {
		srOnlyLabel: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const checkboxGroup = canvas.getByRole('group', {
			name: 'Sandwich condiments',
		})
		expect(checkboxGroup).toBeInTheDocument()
		expect(checkboxGroup).toHaveAccessibleName()

		const dragon = canvas.getByLabelText('Lettuce')
		expect(dragon).toBeChecked() //default value

		const tomato = canvas.getByLabelText('Tomato')
		await userEvent.click(tomato)

		const onion = canvas.getByLabelText('Onion')
		await userEvent.click(onion)

		const array = canvas.getByText('["Lettuce","Tomato","Onion"]')
		expect(array).toBeInTheDocument()
	},
}

export default meta

type Story = StoryObj<typeof CheckboxGroup>

export const WithCheckbox: Story = {}

// ----------

const CheckboxGroupCardsDemo = ({ srOnlyLabel }: { srOnlyLabel?: boolean }) => {
	const [selected, setSelected] = useState<string[]>(['Lettuce'])

	return (
		<div className="flex flex-col gap-4 w-1/2">
			<CheckboxGroup
				value={selected}
				onChange={setSelected}
				label="Sandwich condiments"
				srOnlyLabel={srOnlyLabel}
			>
				{['Lettuce', 'Tomato', 'Onion', 'Sprouts'].map((i) => {
					return <CheckboxCard key={i} label={i} id={i} value={i} />
				})}
			</CheckboxGroup>
			<Separator />
			<div className="text-gray-500">
				<div className="font-medium">group value:</div>
				{JSON.stringify(selected)}
			</div>
		</div>
	)
}

export const WithCheckboxCard: Meta<typeof CheckboxGroup> = {
	title: 'Forms/Inputs/CheckboxGroup',
	render: ({ ...args }) => <CheckboxGroupCardsDemo srOnlyLabel={args.srOnlyLabel} />,
	args: {
		srOnlyLabel: false,
	},
}
