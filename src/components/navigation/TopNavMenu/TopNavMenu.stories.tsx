import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from '@/theme/Icons'
import { userEvent, waitFor, within, expect } from '@storybook/test'
import { TopNavMenu, TopNavMenuListItem, TopNavMenuGroup, TopNavMenuButton } from './TopNavMenu'

const TopNavMenuDemo = () => {
	// router mock for story only
	const [currentLink, setCurrentLink] = useState('/a')
	const handleClick = (
		event: React.MouseEvent<HTMLAnchorElement | HTMLLIElement, MouseEvent>,
		path: string
	) => {
		event.preventDefault() //storybook should not navigate
		setCurrentLink(path)
	}

	return (
		<TopNavMenu className="shadow">
			{/* onClick on an <a> is bad! this is for the story only (instead of a mock) */}
			<TopNavMenuListItem isCurrent={currentLink === '/a'} onClick={(e) => handleClick(e, '/a')}>
				<a href="/a">Home</a>
			</TopNavMenuListItem>

			<TopNavMenuGroup title="Documentation" hasCurrentChildItem={currentLink.startsWith('/b')}>
				<TopNavMenuListItem isCurrent={currentLink == '/bb'}>
					{/* onClick on an <a> is bad! this is for the story only (instead of a mock) */}
					<a href="/bb" onClick={(e) => handleClick(e, '/bb')}>
						How to do stuff
					</a>
				</TopNavMenuListItem>
				<TopNavMenuListItem isCurrent={currentLink == '/bbb'}>
					<a href="/bbb" onClick={(e) => handleClick(e, '/bbb')}>
						This is a longer link name
					</a>
				</TopNavMenuListItem>
				<TopNavMenuButton onClick={() => alert('button action')}>
					A button in the content
				</TopNavMenuButton>
			</TopNavMenuGroup>

			<TopNavMenuListItem>
				<a href="https://www.example.com/" target="_blank">
					Example Site
				</a>
				<Icon name="ExternalLink" />
			</TopNavMenuListItem>

			<TopNavMenuButton onClick={() => alert('button action')}>
				Button <Icon name="LogOut" size="sm" />
			</TopNavMenuButton>
		</TopNavMenu>
	)
}

const meta: Meta = {
	title: 'Navigation/TopNavMenu',
	render: () => <TopNavMenuDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		const nav = canvas.getByRole('navigation', { name: 'Top Navigation' })
		expect(nav).toBeInTheDocument()
		expect(nav).toBeVisible()
		expect(nav).toHaveAttribute('aria-label', 'Top Navigation')
		expect(nav).toHaveAccessibleName()

		const trigger = within(nav).getByRole('button', {
			name: 'Documentation',
		})
		expect(trigger).toBeVisible()
		expect(trigger).toHaveAccessibleName()
		expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
		expect(trigger).toHaveAttribute('aria-expanded', 'false')
		expect(trigger).toHaveAttribute('data-state', 'closed')

		const triggerChevron = within(trigger).getByTestId('chevron')
		expect(triggerChevron).toBeVisible()
		expect(triggerChevron).toHaveAttribute('aria-hidden', 'true')

		await userEvent.hover(trigger)
		await waitFor(async () => {
			const link1 = canvas.getByRole('link', { name: 'How to do stuff' })
			expect(link1).toBeVisible()
			expect(link1).toHaveAttribute('href', '/bb')
		})
		expect(trigger).toHaveAttribute('aria-expanded', 'true')
		expect(trigger).toHaveAttribute('data-state', 'open')

		await userEvent.unhover(trigger)
		await waitFor(async () => {
			expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
			expect(trigger).toHaveAttribute('aria-expanded', 'false')
			const link1 = canvas.queryByRole('link', { name: 'Gas' })
			expect(link1).not.toBeInTheDocument()
		})

		const linkItem = within(nav).getByRole('link', {
			name: 'Example Site',
		})
		expect(linkItem).toBeVisible()
		expect(linkItem).toHaveAccessibleName()
		expect(linkItem).toHaveAttribute('href', 'https://www.example.com/')
		expect(linkItem).toHaveAttribute('target', '_blank')

		const button = canvas.getByRole('button', { name: 'Button' })
		expect(button).toBeVisible()
		expect(button).toHaveAccessibleName()
	},
}

export default meta

type Story = StoryObj

export const Default: Story = {}
