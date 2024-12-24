import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DateFormat } from 'src/backlog/DateFormat'
import { within, expect } from '@storybook/test'

const date: Date = new Date('2023-12-08T17:40:16.541Z')

const meta: Meta<typeof DateFormat> = {
	title: 'Utility/DateFormat',
	render: ({ dateFormat, timeFormat }) => (
		<DateFormat date={date} dateFormat={dateFormat} timeFormat={timeFormat} />
	),
	args: {
		dateFormat: 'medium',
	},
	argTypes: {
		dateFormat: {
			control: 'radio',
			options: ['numerical', 'short', 'medium', 'long'],
		},
		timeFormat: { control: 'radio', options: [undefined, 'time', 'timezone'] },
	},
	parameters: {
		controls: {
			exclude: ['date', 'className'],
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		let dateString
		if (args.dateFormat === 'numerical') {
			dateString = canvas.getByText('12/8/2023')
		}
		if (args.dateFormat === 'short') {
			dateString = canvas.getByText('Dec 8, 2023')
		}
		if (args.dateFormat === 'medium') {
			dateString = canvas.getByText('December 8, 2023')
		}
		if (args.dateFormat === 'long') {
			dateString = canvas.getByText('Friday, December 8, 2023')
		}

		await expect(dateString).toBeVisible()
		await expect(dateString).toBeValid()

		const timeElementDateTime = new Intl.DateTimeFormat('fr-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).format(date) // 2023-12-08

		await expect(dateString).toHaveAttribute('datetime', timeElementDateTime)
	},
}

export default meta

type Story = StoryObj<typeof DateFormat>

export const Default: Story = {}
