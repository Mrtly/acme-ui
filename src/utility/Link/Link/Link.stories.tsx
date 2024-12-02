import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from '@storybook/test'
import { Link as LinkComponent } from 'src/utility/Link'
import { Separator } from '../../Separator'

const meta: Meta<typeof LinkComponent> = {
	title: 'Navigation/Link/Link',
	render: ({ size }) => (
		<div className="w-fit pb-6">
			<div className="text-sm mb-4">Link (default action variant)</div>
			<LinkComponent
				size={size}
				href="/"
				//this is for the story only, so SB does NOT navigate
				onClick={(e) => e.preventDefault()}
			>
				anchor link
			</LinkComponent>

			<Separator className="my-4" />
			<div className="text-sm mb-4">Link with label only (action variant)</div>
			<LinkComponent
				size={size}
				href="/"
				onClick={(e) => e.preventDefault()} //this is for the story only, so SB does NOT navigate
				iconName={null}
			>
				label-only link
			</LinkComponent>

			<Separator className="my-4" />
			<div className="text-sm mb-4">Link `isFullWidth`</div>
			<LinkComponent
				size={size}
				href="/"
				onClick={(e) => e.preventDefault()} //this is for the story only, so SB does NOT navigate
				iconName="ChevronRight"
				isFullWidth
			>
				Shop rates
			</LinkComponent>

			<Separator className="my-4" />
			<div className="text-sm mb-4">Link with `iconName`</div>
			<div className="text-sm mb-4">`iconPosition=right`</div>
			<LinkComponent
				size={size}
				href="/"
				iconName="ArrowRight"
				onClick={(e) => e.preventDefault()} //this is for the story only, so SB does NOT navigate
			>
				Next Link
			</LinkComponent>

			<div className="text-sm my-4">`iconPosition=left`</div>
			<LinkComponent
				size={size}
				href="/"
				onClick={(e) => e.preventDefault()} //this is for the story only, so SB does NOT navigate
				iconPosition="left"
				iconName="Edit"
				variant="action"
			>
				Edit
			</LinkComponent>

			<Separator className="my-4" />
			<div className="text-sm mb-4">Link `isExternal`</div>
			<LinkComponent size={size} href="https://www.example.com/" isExternal>
				external link
			</LinkComponent>

			<Separator className="my-4" />
			<div className="mb-2 text-sm">Link `variant=inline`</div>
			<p>
				Visit{' '}
				<LinkComponent size={size} variant="inline" href="https://www.example.com/" isExternal>
					our website
				</LinkComponent>{' '}
				for more information about our products and services.
			</p>
		</div>
	),
	args: {
		size: 'md',
	},
	argTypes: {
		size: {
			options: ['sm', 'md', 'lg', 'xl'],
			control: {
				type: 'select',
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const link1 = canvas.getByRole('link', { name: 'anchor link' })
		expect(link1).toBeVisible()
		expect(link1).toHaveAccessibleName()
		expect(link1).toHaveAttribute('href', '/')
		const chevron = within(link1).getByTestId('ChevronRight-icon-right')
		expect(chevron).toBeInTheDocument()

		const labelOnlyLink = canvas.getByRole('link', { name: 'label-only link' })
		expect(labelOnlyLink).toBeVisible()
		expect(labelOnlyLink).toHaveAccessibleName()
		const nochevron = within(labelOnlyLink).queryByTestId('ChevronRight-icon-right')
		expect(nochevron).not.toBeInTheDocument()

		const fullWidthLink = canvas.getByRole('link', { name: 'Shop rates' })
		expect(fullWidthLink).toBeVisible()
		expect(fullWidthLink).toHaveAccessibleName()
		const chevronInFw = within(fullWidthLink).getByTestId('ChevronRight-icon-right')
		expect(chevronInFw).toBeInTheDocument()
		expect(fullWidthLink).toHaveClass('justify-between')

		const iconLeftLink = canvas.getByRole('link', { name: /Edit/i })
		const iconLeft = within(iconLeftLink).getByTestId('Edit-icon-left')
		expect(iconLeft).toBeInTheDocument()
		expect(iconLeftLink).toBeVisible()
		expect(iconLeftLink).toHaveAccessibleName()

		const externallink = canvas.getByRole('link', {
			name: 'external link',
		})
		expect(externallink).toHaveAttribute('href', 'https://www.example.com/')
		expect(externallink).toHaveAttribute('target', '_blank')
		const exticon = within(externallink).getByTestId('external-icon')
		expect(exticon).toBeVisible()

		const inlinelink = canvas.getByRole('link', {
			name: 'our website',
		})
		expect(inlinelink).toHaveAttribute('href', 'https://www.example.com/')
		expect(inlinelink).toHaveClass('underline underline-offset-2')
	},
}
export default meta

type Story = StoryObj<typeof LinkComponent>

export const Default: Story = {}
