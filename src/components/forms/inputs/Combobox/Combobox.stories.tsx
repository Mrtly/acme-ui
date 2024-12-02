import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	Combobox,
	ComboboxContent,
	ComboboxItem,
	ComboboxTrigger,
	ComboboxSection,
} from './Combobox'
import { screen, within, expect, userEvent, waitFor } from '@storybook/test'

const meta: Meta = {
	title: 'Forms/Inputs/Combobox',
	render: ({ ...args }) => (
		<div className="max-w-[220px]">
			<Combobox
				name="story"
				label={args.label}
				srOnlyLabel={args.srOnlyLabel}
				showOptional={args.showOptional}
				disabled={args.disabled}
				required={args.required}
				readOnly={args.readOnly}
			>
				<ComboboxTrigger
					id="combobox"
					placeholder={args.placeholder}
					error={args.error}
					small={args.small}
				/>

				<ComboboxContent>
					<ComboboxItem value="vanilla">Vanilla</ComboboxItem>
					<ComboboxItem value="chocolate">Chocolate</ComboboxItem>
					<ComboboxItem value="strawberry">Strawberry</ComboboxItem>
					<ComboboxItem value="cookies">Cookies</ComboboxItem>
					<ComboboxSection title="Sorbet">
						<ComboboxItem value="lemon">Lemon sorbet</ComboboxItem>
					</ComboboxSection>
				</ComboboxContent>
			</Combobox>
		</div>
	),
	args: {
		label: 'Ice cream flavor',
		placeholder: 'Start typing...',
		error: false,
		disabled: false,
		small: false,
		required: false,
		readOnly: false,
		showOptional: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const combobox = canvas.getByRole('combobox', {
			name: new RegExp(args.label, 'i'),
		})
		await expect(combobox).toBeInTheDocument()
		await expect(combobox).toBeVisible()
		await expect(combobox).toHaveAccessibleName()
		args.disabled ? await expect(combobox).toBeDisabled() : await expect(combobox).toBeEnabled()
		args.readOnly
			? await expect(combobox).toHaveAttribute('readonly')
			: expect(combobox).not.toHaveAttribute('readonly')
		args.required ? await expect(combobox).toBeRequired() : expect(combobox).not.toBeRequired()

		if (args.disabled || args.readOnly) return

		await userEvent.click(combobox)
		await expect(combobox).toHaveFocus()
		await userEvent.keyboard('[ArrowDown]')
		let listbox = screen.getByRole('listbox')
		await waitFor(async () => {
			listbox = screen.getByRole('listbox')
			await expect(listbox).toBeVisible()
		})
		const vanilla = within(listbox!).getByRole('option', { name: 'Vanilla' })
		await userEvent.click(vanilla)
		await expect(combobox).toHaveAttribute('value', 'Vanilla')
		combobox.blur()
	},
}

export default meta

export const Default: StoryObj = {}

// Search variant

export const Search = {
	render: ({ ...args }) => (
		<div className="max-w-[220px]">
			<Combobox
				name="story"
				label={args.label}
				srOnlyLabel={args.srOnlyLabel}
				showOptional={args.showOptional}
				disabled={args.disabled}
				required={args.required}
				readOnly={args.readOnly}
			>
				<ComboboxTrigger
					id="combobox"
					placeholder={args.placeholder}
					error={args.error}
					small={args.small}
					variant="search"
				/>

				<ComboboxContent variant="search">
					<ComboboxItem variant="search" value="vanilla">
						Vanilla
					</ComboboxItem>
					<ComboboxItem variant="search" value="chocolate">
						Chocolate
					</ComboboxItem>
					<ComboboxItem variant="search" value="strawberry">
						Strawberry
					</ComboboxItem>
					<ComboboxItem variant="search" value="cookies">
						Cookies
					</ComboboxItem>
					<ComboboxSection title="Sorbet">
						<ComboboxItem variant="search" value="lemon">
							Lemon sorbet
						</ComboboxItem>
					</ComboboxSection>
				</ComboboxContent>
			</Combobox>
		</div>
	),
	args: {
		label: 'Ice cream flavor',
		placeholder: 'Start typing...',
		error: false,
		disabled: false,
		small: false,
		required: false,
		readOnly: false,
		showOptional: false,
	},
}
