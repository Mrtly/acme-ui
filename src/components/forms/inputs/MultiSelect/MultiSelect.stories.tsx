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
	{ id: '1-vanilla', name: 'Vanilla' },
	{ id: '2-chocolate', name: 'Chocolate' },
	{ id: '3-strawberry', name: 'Strawberry' },
	{ id: '4-mint-chip', name: 'Mint Chip' },
	{ id: '5-cookies-n-cream', name: 'Cookies and Cream' },
	{ id: '6-butter-pecan', name: 'Butter Pecan' },
	{ id: '7-rocky-road', name: 'Rocky Road' },
	{ id: '8-neapolitan', name: 'Neapolitan' },
	{ id: '9-coffee', name: 'Coffee' },
	{ id: '10-pistachio', name: 'Pistachio' },
	{ id: '11-caramel-swirl', name: 'Caramel Swirl' },
	{ id: '12-mango', name: 'Mango' },
	{ id: '13-matcha', name: 'Matcha' },
	{ id: '14-black-raspberry', name: 'Black Raspberry' },
	{ id: '15-salted-caramel', name: 'Salted Caramel' },
	{ id: '16-lemon', name: 'Lemon' },
	{ id: '17-birthday-cake', name: 'Birthday Cake' },
	{ id: '18-cherry-garcia', name: 'Cherry Garcia' },
	{ id: '19-banana', name: 'Banana' },
	{ id: '20-hazelnut', name: 'Hazelnut' },
]

const meta: Meta = {
	title: 'Input/MultiSelect',
	render: ({ ...args }) => (
		<div className="max-w-sm mt-40">
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
			const itemMint = await screen.findByRole('button', { name: 'Mint Chip' }) //popover stays open
			await expect(itemMint).toHaveAttribute('aria-pressed', 'false') //not selected
			await userEvent.click(itemMint)
			await expect(itemMint).toHaveAttribute('aria-pressed', 'true') //item is selected
			await expect(multiselect).toHaveAttribute('aria-expanded', 'true')
			await expect(canvas.getByText('2 items selected')).toBeVisible()

			const itemPecan = await screen.findByRole('button', { name: 'Butter Pecan' })
			await userEvent.click(itemPecan)
			await expect(canvas.getByText('3 items selected')).toBeVisible()

			//close popover
			await userEvent.keyboard('{Escape}')
			await expect(multiselect).toHaveAttribute('aria-expanded', 'false') //popover closes
		}
	},
}

export default meta

type Story = StoryObj

export const Default: Story = {}

// -----

const extraFlavors: Array<MultiSelectItemType> = [
	{ id: '21-blueberry-cheesecake', name: 'Blueberry Cheesecake' },
	{ id: '22-honey-lavender', name: 'Honey Lavender' },
	{ id: '23-peanut-butter-cup', name: 'Peanut Butter Cup' },
	{ id: '24-coconut', name: 'Coconut' },
	{ id: '25-smore', name: 'S’mores' },
	{ id: '26-gingerbread', name: 'Gingerbread' },
	{ id: '27-key-lime-pie', name: 'Key Lime Pie' },
	{ id: '28-tiramisu', name: 'Tiramisu' },
	{ id: '29-raspberry-sorbet', name: 'Raspberry Sorbet' },
	{ id: '30-apple-pie', name: 'Apple Pie', disabled: true },
]

export const WithMaxHeight = {
	render: ({ ...args }) => (
		<div className="max-w-sm">
			<MultiSelect maxHeight={240} label={args.label} {...args} onChange={(v) => console.log(v)}>
				<MultiSelectTrigger />
				<MultiSelectContent>
					{items.concat(extraFlavors).map((item) => (
						<MultiSelectItem key={item.id} item={item} />
					))}
				</MultiSelectContent>
			</MultiSelect>
		</div>
	),
}
