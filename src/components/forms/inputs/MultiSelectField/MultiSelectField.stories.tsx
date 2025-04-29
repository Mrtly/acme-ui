import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { MultiSelectField, MultiSelectFieldItem } from './MultiSelectField'
import type { MultiSelectItemType } from '@/components/inputs/MultiSelect'
import { Button } from '@/components/buttons/Button'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { screen, userEvent, within, expect } from '@storybook/test'

const items: Array<MultiSelectItemType> = [
	{ id: '1-chocolate', name: 'Chocolate' },
	{ id: '2-mint', name: 'Mint' },
	{ id: '3-strawberry', name: 'Strawberry' },
	{ id: '4-vanilla', name: 'Vanilla' },
	{ id: '5-caramel', name: 'Caramel', disabled: true },
]

const FormSchema = z.object({
	multi_select: z.array(z.string()).min(1, 'At least one option must be selected'),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

// @ts-expect-error args any type
const MultiSelectFieldDemo = ({ args }) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<>
			<Form formMethods={form} formName="Select form" onSubmit={onSubmit} className="w-60">
				<MultiSelectField
					control={form.control}
					name="multi_select"
					label={args.label}
					id="multi-select"
					{...args}
				>
					{items.map((item) => (
						<MultiSelectFieldItem key={item.id} item={item} />
					))}
				</MultiSelectField>

				<div className="mt-2">
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</>
	)
}

const meta: Meta<typeof MultiSelectFieldDemo> = {
	title: 'Forms/Fields/MultiSelectField',
	render: ({ ...args }) => <MultiSelectFieldDemo args={args} />,
	args: {
		// @ts-expect-error args
		label: 'Ice cream flavors',
		placeholder: undefined,
		description: 'Select your ice cream flavor',
		srOnlyLabel: false,
		srOnlyDescription: false,
		disabled: false,
		required: true,
		showOptional: true,
	},
	argTypes: {
		// @ts-expect-error args
		placeholder: { control: 'text' },
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const multiselect = canvas.getByLabelText(/Ice cream flavors/i)
		await expect(multiselect).toBeVisible()
		await expect(multiselect).toHaveAttribute('aria-expanded', 'false')
		await expect(multiselect).toHaveAccessibleName()

		// @ts-expect-error any args
		if (args.description) {
			await expect(multiselect).toHaveAccessibleDescription()
		}

		// @ts-expect-error any args
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
			await expect(multiselect).toHaveAttribute('aria-expanded', 'false') // popover closes

			//submit
			const submit = canvas.getByRole('button', { name: 'Submit' })
			await userEvent.click(submit)
			await expect(
				screen.getByRole('alertdialog', {
					name: 'You submitted the following values:',
				})
			).toBeVisible()
			const dismissToast = screen.getAllByRole('button', { name: 'Dismiss' })[0]
			await userEvent.click(dismissToast)
		}
	},
}

export default meta

type Story = StoryObj<typeof MultiSelectFieldDemo>

export const Default: Story = {}
