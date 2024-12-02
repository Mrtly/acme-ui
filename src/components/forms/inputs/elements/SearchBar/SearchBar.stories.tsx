import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SearchBar } from '@/components/forms/inputs/elements/SearchBar'
import { userEvent, within, waitFor, expect } from '@storybook/test'

const meta: Meta<typeof SearchBar> = {
	title: 'Forms/Inputs/Elements/SearchBar',
	render: ({ label, srOnlyLabel, placeholder, small, showSearchIcon }) => (
		<div className="max-w-sm">
			<SearchBar
				id="searchbar"
				label={label}
				srOnlyLabel={srOnlyLabel}
				placeholder={placeholder}
				small={small}
				showSearchIcon={showSearchIcon}
				onValueChange={(v) => console.log(v)}
			/>
		</div>
	),
	args: {
		label: 'Search',
		srOnlyLabel: false,
		placeholder: 'Search for something',
		showSearchIcon: true,
		small: false,
	},
	parameters: {
		controls: { exclude: ['className', 'id'] },
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const searchbar = canvas.getByLabelText(args.label!)
		await expect(searchbar).toBeInTheDocument()
		await expect(searchbar).toHaveAccessibleName()
		await expect(searchbar).toHaveAttribute('placeholder', args.placeholder)
		await expect(searchbar).toHaveValue('')
		let clearBtn = canvas.queryByRole('button', { name: 'clear search' })
		expect(clearBtn).not.toBeInTheDocument()

		await userEvent.type(searchbar, 'circle')
		await waitFor(() => expect(searchbar).toHaveValue('circle'))
		clearBtn = canvas.getByRole('button', { name: 'clear search' })
		await expect(clearBtn).toBeInTheDocument()
		await expect(clearBtn).toBeVisible()
		await userEvent.click(clearBtn)
		await expect(searchbar).toHaveValue('')
		expect(clearBtn).not.toBeInTheDocument()
	},
}

export default meta

type Story = StoryObj<typeof SearchBar>

export const Default: Story = {}
