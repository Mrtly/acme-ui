import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'
import { within, expect } from '@storybook/test'
import { useEffect, useState } from 'react'
import { Separator } from '../../../utility/Separator'

const ProgressBarDemo = () => {
	const [value, setValue] = useState<number>(0)

	useEffect(() => {
		const intervalId = setInterval(() => {
			if (value < 100) {
				setValue((prevValue) => prevValue + 1)
			} else {
				clearInterval(intervalId) // Stop the interval when value reaches 100
			}
		}, 100)

		return () => clearInterval(intervalId)
	}, [value])

	return (
		<div className="w-1/2 flex flex-col gap-10">
			<div>
				<div className="text-sm text-gray-500 mb-6">indeterminate</div>
				<ProgressBar label="Uploading..." indeterminate />
			</div>
			<Separator />
			<div>
				<div className="text-sm text-gray-500 mb-6">with percentage value</div>
				<ProgressBar label="Uploading..." value={value} />
			</div>
			<Separator />
			<div>
				<div className="text-sm text-gray-500 mb-6">with screen-reader-only label</div>
				<ProgressBar label="Uploading..." value={value} srOnlyLabel />
			</div>
		</div>
	)
}

const meta: Meta<typeof ProgressBarDemo> = {
	title: 'Visualization/ProgressBar',

	render: () => <ProgressBarDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		const bars = canvas.getAllByRole('progressbar', {
			name: 'Uploading...', //means bar is properly labelled
		})
		expect(bars).toHaveLength(3)

		const indeterminate = bars[0]
		expect(indeterminate).toBeVisible()
		expect(indeterminate).toHaveAccessibleName()
		expect(indeterminate).toHaveAttribute('data-state', 'indeterminate')

		const bar = bars[1]
		expect(bar).toBeVisible()
		expect(bar).toHaveAccessibleName()
		expect(bar).not.toHaveAttribute('data-state', 'indeterminate')
		expect(bar).toHaveAttribute('aria-valuenow')
	},
}

export default meta

export const Default: StoryObj<typeof ProgressBar> = {}
