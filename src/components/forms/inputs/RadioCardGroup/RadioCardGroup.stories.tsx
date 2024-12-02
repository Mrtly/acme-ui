import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioCardGroup, RadioCard } from './RadioCardGroup'
import { Badge } from '@/components/display/Badge'
import { Separator } from '../../../../utility/Separator'
import { within, expect, userEvent } from '@storybook/test'

const meta: Meta = {
	title: 'Forms/Inputs/RadioCardGroup',
	render: ({ ...args }) => (
		<>
			<RadioCardGroup
				legend="Favorite pet"
				name="pets"
				defaultValue="cat"
				error={args.error}
				disabled={args.disabled}
				readOnly={args.readOnly}
				required={args.required}
				showOptional={args.showOptional}
				srOnlyLegend={args.srOnlyLegend}
				className="max-w-max"
			>
				<RadioCard
					id="dog"
					value="dog"
					label="Dog"
					rightSlot={<Badge variant="outline">10 points</Badge>}
				/>
				<RadioCard
					id="cat"
					value="cat"
					label="Cat"
					rightSlot={<Badge variant="outline">20 points</Badge>}
				/>
				<RadioCard
					id="dragon"
					value="dragon"
					label="Dragon"
					rightSlot={<Badge variant="outline">50 points</Badge>}
				/>
			</RadioCardGroup>
			<Separator className="my-6" />
			<RadioCardGroup
				legend="Favorite pet 2"
				name="pets2"
				defaultValue="cat"
				error={args.error}
				disabled={args.disabled}
				readOnly={args.readOnly}
				required={args.required}
				showOptional={args.showOptional}
				srOnlyLegend={args.srOnlyLegend}
				orientation="horizontal"
			>
				<div>
					<RadioCard
						id="dog"
						value="dog"
						label="Dog"
						bottomSlot={<Badge variant="outline">10 points</Badge>}
					/>
				</div>
				<div>
					<RadioCard
						id="cat"
						value="cat"
						label="Cat"
						bottomSlot={<Badge variant="outline">20 points</Badge>}
					/>
				</div>
				<div>
					<RadioCard
						id="dragon"
						value="dragon"
						label="Dragon"
						bottomSlot={<Badge variant="outline">50 points</Badge>}
						disabled
					/>
				</div>
			</RadioCardGroup>
		</>
	),
	args: {
		error: false,
		disabled: false,
		readOnly: false,
		required: false,
		showOptional: false,
		srOnlyLegend: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const radioCards = canvas.getByRole('radiogroup', {
			name: 'Favorite pet',
		})
		await expect(radioCards).toHaveAccessibleName()
		if (args.required) {
			await expect(radioCards).toBeRequired()
		} else if (!args.required) {
			expect(radioCards).not.toBeRequired()
		}
		if (args.disabled) {
			await expect(radioCards).toHaveAttribute('aria-disabled', 'true')
			return
		}
		if (args.readOnly) {
			await expect(radioCards).toHaveAttribute('aria-readonly', 'true')
			return
		}
		const cat = within(radioCards).getByLabelText('Cat')
		await expect(cat).toHaveAccessibleName()
		await expect(cat).toHaveAttribute('value', 'cat')
		await expect(cat).toBeChecked()
		const dragon = within(radioCards).getByLabelText('Dragon')
		await expect(dragon).toHaveAccessibleName()
		await expect(dragon).toHaveAttribute('value', 'dragon')
		await userEvent.click(dragon)
		expect(cat).not.toBeChecked()
		await expect(dragon).toBeChecked()
	},
}

export default meta

type Story = StoryObj

export const Default: Story = {}
