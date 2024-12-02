import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PhoneFormat } from './PhoneFormat'
import { within, expect } from '@storybook/test'
import { Separator } from '../../utility/Separator'

const meta: Meta = {
	title: 'Utility/PhoneFormat',
	render: () => (
		<div className="max-w-md font-semibold">
			<div>
				The street address entered cannot be found in our system. For assistance, call{' '}
				<PhoneFormat phoneNum="18557431101" />.
			</div>

			<Separator className="my-4 w-32" />

			<div>
				The street address entered cannot be found in our system. For assistance, call{' '}
				<PhoneFormat phoneNum="8557431102" />.
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		const phoneElement = await canvas.findByText(/1-855-743-1101/i)
		expect(phoneElement).toBeInTheDocument()
		expect(phoneElement).toHaveTextContent(/1-855-743-1101/i)

		const phoneElement2 = await canvas.findByText(/855-743-1102/i)
		expect(phoneElement2).toBeInTheDocument()
		expect(phoneElement2).toHaveTextContent(/855-743-1102/i)
	},
}

export default meta

export const Default: StoryObj = {}

export const MobileView: Meta = {
	render: () => (
		<div className="max-w-md font-semibold">
			<div>
				The street address entered cannot be found in our system. For assistance, call{' '}
				<PhoneFormat phoneNum="18557431101" />.
			</div>

			<Separator className="my-4 w-32" />

			<div>
				The street address entered cannot be found in our system. For assistance, call{' '}
				<PhoneFormat phoneNum="8557431102" />.
			</div>
		</div>
	),
	parameters: {
		viewport: {
			defaultViewport: 'mobile1',
		},
	},
	// test for local dev only - test fails on the test-runner, the viewport does not work
	// play: async ({ canvasElement }) => {
	// 	const canvas = within(canvasElement)

	// 	// a fake delay gives the story the time to render before testing (otherwise it tests too soon & fails)
	// 	await new Promise((resolve) => setTimeout(resolve, 3000))

	// 	const phoneElement = canvas.getByRole('link', {
	// 		name: '1-855-743-1101',
	// 	})
	// 	expect(phoneElement).toBeInTheDocument()
	// 	expect(phoneElement).toHaveAccessibleName()
	// 	expect(phoneElement).toHaveTextContent('1-855-743-1101')
	// 	expect(phoneElement).toHaveAttribute('href', 'tel:+18557431101')

	// 	const phoneElement2 = canvas.getByRole('link', {
	// 		name: '855-743-1102',
	// 	})
	// 	expect(phoneElement2).toBeInTheDocument()
	// 	expect(phoneElement2).toHaveAccessibleName()
	// 	expect(phoneElement2).toHaveTextContent('855-743-1102')
	// 	expect(phoneElement2).toHaveAttribute('href', 'tel:8557431102')
	// },
}
