import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	SideNavMenu,
	SideNavMenuListItem,
	SideNavMenuGroup,
	SideNavMenuButton,
	SideNavMenuSection,
	SideNavMenuDetailsSection,
} from './SideNavMenu'
import { Icon } from '@/theme/Icons'
import { userEvent, waitFor, within, expect } from '@storybook/test'

const SideNavMenuDemo = () => {
	// router mock for story only
	const [currentLink, setCurrentLink] = useState('/b')
	const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
		event.preventDefault() //storybook should not navigate
		setCurrentLink(path)
	}

	return (
		<SideNavMenu className="max-w-[260px] shadow">
			<SideNavMenuSection id="first-section" heading="main list" srOnlyHeading>
				<SideNavMenuListItem isCurrent={currentLink === '/a'}>
					{/* onClick on an <a> is bad! this is for the story only (instead of a mock) */}
					<a href="/a" onClick={(e) => handleClick(e, '/a')}>
						Home
					</a>
				</SideNavMenuListItem>
			</SideNavMenuSection>

			<SideNavMenuSection id="services-section" heading="services">
				<SideNavMenuGroup title="Utilities">
					<SideNavMenuListItem isCurrent={currentLink === '/b'}>
						<Icon name="Wind" size="md" />{' '}
						{/* onClick on an <a> is bad! this is for the story only (instead of a mock) */}
						<a href="/b" onClick={(e) => handleClick(e, '/b')}>
							Gas
						</a>
					</SideNavMenuListItem>
					<SideNavMenuListItem isCurrent={currentLink === '/c'}>
						<Icon name="Zap" size="md" />
						<a href="/c" onClick={(e) => handleClick(e, '/c')}>
							Electric
						</a>
					</SideNavMenuListItem>
				</SideNavMenuGroup>

				<SideNavMenuListItem isCurrent={currentLink === '/d'}>
					<Icon name="DollarSign" size="md" />
					<a href="/d" onClick={(e) => handleClick(e, '/d')}>
						Bills
					</a>
				</SideNavMenuListItem>
			</SideNavMenuSection>

			<SideNavMenuSection id="third-section" heading="profile">
				<SideNavMenuGroup title="Settings" icon={<Icon name="Settings" />}>
					<SideNavMenuListItem isCurrent={currentLink === '/e'}>
						<a href="/e" onClick={(e) => handleClick(e, '/e')}>
							Profile
						</a>
					</SideNavMenuListItem>
				</SideNavMenuGroup>

				<SideNavMenuButton icon={<Icon name="LogOut" />} onClick={() => alert('button action')}>
					Logout
				</SideNavMenuButton>
			</SideNavMenuSection>

			<SideNavMenuDetailsSection title="Components">
				<SideNavMenuSection id="buttons-section" heading="Buttons">
					<SideNavMenuListItem isCurrent={currentLink === '/h'}>
						<a href="/h" onClick={(e) => handleClick(e, '/h')}>
							Button
						</a>
					</SideNavMenuListItem>
				</SideNavMenuSection>
				<SideNavMenuSection id="dialogs-section" heading="Dialogs">
					<SideNavMenuListItem isCurrent={currentLink === '/j'}>
						<a href="/j" onClick={(e) => handleClick(e, '/j')}>
							Alert Dialog
						</a>
					</SideNavMenuListItem>
				</SideNavMenuSection>
			</SideNavMenuDetailsSection>
		</SideNavMenu>
	)
}

const meta: Meta<typeof SideNavMenu> = {
	title: 'Navigation/SideNavMenu',
	render: () => <SideNavMenuDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const nav = canvas.getByRole('navigation')
		expect(nav).toBeInTheDocument()
		expect(nav).toBeVisible()
		expect(nav).toHaveAttribute('aria-label', 'Main navigation')
		expect(nav).toHaveAccessibleName()

		const homeLink = within(nav).getByRole('link', { name: 'Home' })
		expect(homeLink).toBeVisible()
		expect(homeLink).toHaveAccessibleName()

		// test current item, expanding/closing group

		let gasLink
		await waitFor(async () => (gasLink = within(nav).getByRole('link', { name: 'Gas' })))
		expect(gasLink).toBeVisible()
		expect(gasLink).toHaveAccessibleName()
		expect(gasLink).toHaveAttribute('aria-current', 'page')
		const groupItemUtilities = within(nav).getByRole('button', {
			name: 'Utilities',
		})
		expect(groupItemUtilities).toHaveAttribute('aria-expanded', 'true')
		await userEvent.click(groupItemUtilities) //close group
		await waitFor(async () => expect(groupItemUtilities).toHaveAttribute('aria-expanded', 'false'))

		// test expanding/closing group
		const groupItemSettings = within(nav).getByRole('button', {
			name: 'Settings',
		})
		expect(groupItemSettings).toBeVisible()
		expect(groupItemSettings).toHaveAccessibleName()
		expect(groupItemSettings).toHaveAttribute('aria-haspopup', 'menu')
		expect(groupItemSettings).toHaveAttribute('aria-expanded', 'false')
		await userEvent.click(groupItemSettings) //open group
		const profile = within(nav).getByRole('link', { name: 'Profile' })
		expect(profile).toBeVisible()
		expect(profile).toHaveAccessibleName()
		await userEvent.click(groupItemSettings) //close group
		expect(profile).not.toBeVisible()

		//nav button item
		const logoutBtn = within(nav).getByRole('button', { name: 'Logout' })
		expect(logoutBtn).toBeVisible()
		expect(logoutBtn).toHaveAccessibleName()

		//test details section
		const detailsElement = canvas.getByText('Components')
		expect(detailsElement.parentElement).not.toHaveAttribute('open')
		await userEvent.click(detailsElement)
		expect(detailsElement.parentElement).toHaveAttribute('open')

		const buttonLink = within(nav).getByRole('link', { name: 'Button' })
		expect(buttonLink).toBeVisible()
		expect(buttonLink).toHaveAccessibleName()
		await userEvent.click(buttonLink)
	},
}

export default meta

type Story = StoryObj<typeof SideNavMenu>

export const Default: Story = {}
