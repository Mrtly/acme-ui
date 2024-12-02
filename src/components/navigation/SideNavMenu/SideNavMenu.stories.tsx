import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	SideNavMenu,
	SideNavMenuLink,
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
				<SideNavMenuLink
					href="/a"
					current={currentLink === '/a'}
					onClick={(e) => handleClick(e, '/a')}
				>
					Home
				</SideNavMenuLink>
			</SideNavMenuSection>

			<SideNavMenuSection id="services-section" heading="services">
				<SideNavMenuGroup title="Utilities">
					<SideNavMenuLink
						href="/b"
						icon={<Icon name="Wind" />}
						current={currentLink === '/b'}
						onClick={(e) => handleClick(e, '/b')}
					>
						Gas
					</SideNavMenuLink>
					<SideNavMenuLink
						href="/c"
						icon={<Icon name="Zap" />}
						current={currentLink === '/c'}
						onClick={(e) => handleClick(e, '/c')}
					>
						Electric
					</SideNavMenuLink>
				</SideNavMenuGroup>

				<SideNavMenuLink
					href="/d"
					icon={<Icon name="DollarSign" />}
					current={currentLink === '/d'}
					onClick={(e) => handleClick(e, '/d')}
				>
					Bills
				</SideNavMenuLink>
			</SideNavMenuSection>

			<SideNavMenuSection id="third-section" heading="profile">
				<SideNavMenuGroup title="Settings" icon={<Icon name="Settings" />}>
					<SideNavMenuLink
						href="/e"
						current={currentLink === '/e'}
						onClick={(e) => handleClick(e, '/e')}
					>
						Profile
					</SideNavMenuLink>
				</SideNavMenuGroup>

				<SideNavMenuButton icon={<Icon name="LogOut" />} onClick={() => alert('button action')}>
					Logout
				</SideNavMenuButton>
			</SideNavMenuSection>

			<SideNavMenuDetailsSection title="Components">
				<SideNavMenuSection id="buttons-section" heading="Buttons">
					<SideNavMenuLink
						href="/h"
						current={currentLink === '/h'}
						onClick={(e) => handleClick(e, '/h')}
					>
						Button
					</SideNavMenuLink>
					<SideNavMenuLink
						href="/i"
						current={currentLink === '/i'}
						onClick={(e) => handleClick(e, '/i')}
					>
						IconButton
					</SideNavMenuLink>
				</SideNavMenuSection>
				<SideNavMenuSection id="dialogs-section" heading="Dialogs">
					<SideNavMenuLink
						href="/j"
						current={currentLink === '/j'}
						onClick={(e) => handleClick(e, '/j')}
					>
						Alert Dialog
					</SideNavMenuLink>
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
		expect(gasLink).toHaveClass('text-brand')
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
		expect(buttonLink).toHaveClass('text-brand')
	},
}

export default meta

type Story = StoryObj<typeof SideNavMenu>

export const Default: Story = {}
