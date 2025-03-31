import type { Meta, StoryObj } from '@storybook/react'
import { screen, userEvent, within, expect } from '@storybook/test'
import {
	MultiSelectItemType,
	MultiSelect,
	MultiSelectItem,
	MultiSelectContent,
	MultiSelectTrigger,
} from './MultiSelect'

const items: Array<MultiSelectItemType> = [
	{ id: '1-chocolate', name: 'Chocolate' },
	{ id: '2-mint', name: 'Mint' },
	{ id: '3-strawberry', name: 'Strawberry' },
	{ id: '4-vanilla', name: 'Vanilla' },
	{ id: '5-caramel', name: 'Caramel', disabled: true },
]

const meta: Meta = {
	title: 'Inputs/MultiSelect',
	render: ({ ...args }) => (
		<div className="max-w-sm">
			<MultiSelect label={args.label} {...args} onChange={(v) => console.log(v)}>
				<MultiSelectTrigger />
				<MultiSelectContent>
					{items.map((item) => (
						<MultiSelectItem key={item.id} item={item} />
					))}
				</MultiSelectContent>
			</MultiSelect>
		</div>
	),
	args: {
		label: 'Ice cream flavors',
		placeholder: undefined,
		srOnlyLabel: false,
		error: false,
		disabled: false,
		required: false,
		showOptional: false,
	},
	argTypes: {
		placeholder: { control: 'text' },
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const multiselect = canvas.getByLabelText(/Ice cream flavors/i)
		await expect(multiselect).toBeVisible()
		await expect(multiselect).toHaveAttribute('aria-expanded', 'false')
		await expect(multiselect).toHaveAccessibleName()

		if (args.description) {
			await expect(multiselect).toHaveAccessibleDescription()
		}

		if (args.disabled) {
			await expect(multiselect).toBeDisabled()
		} else {
			//open dropdown
			await userEvent.click(multiselect)
			await expect(multiselect).toHaveAttribute('aria-expanded', 'true')
			//select 1 item
			const itemChoco = screen.getByRole('button', { name: 'Chocolate' })
			await expect(itemChoco).toHaveAccessibleName()
			await expect(itemChoco).toHaveAttribute('aria-pressed', 'false') //not selected
			await userEvent.click(itemChoco)
			await expect(itemChoco).toHaveAttribute('aria-pressed', 'true') //item is selected
			await expect(multiselect).toHaveAttribute('aria-expanded', 'true') //popover stays open
			await expect(canvas.getByText('1 item selected')).toBeVisible()

			//select 2nd item
			const itemMint = await screen.findByRole('button', { name: 'Mint' }) //popover stays open
			await expect(itemMint).toHaveAttribute('aria-pressed', 'false') //not selected
			await userEvent.click(itemMint)
			await expect(itemMint).toHaveAttribute('aria-pressed', 'true') //item is selected
			await expect(multiselect).toHaveAttribute('aria-expanded', 'true')
			await expect(canvas.getByText('2 items selected')).toBeVisible()

			//close popover
			await userEvent.click(multiselect)
			await expect(multiselect).toHaveAttribute('aria-expanded', 'false') //popover closes

			//open & remove selection
			await userEvent.click(multiselect)
			await userEvent.click(itemChoco)
			await userEvent.click(itemMint)
			await userEvent.click(multiselect)
		}
	},
}

export default meta

type Story = StoryObj

export const Default: Story = {}
