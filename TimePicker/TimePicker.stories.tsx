import { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { TimePicker } from './TimePicker'
import { Time } from '@internationalized/date'
import { within, expect, userEvent } from '@storybook/test'

// @ts-expect-error args any type
const TimePickerDemo = ({ args }) => {
	const [time, setTime] = useState<Time | null>(null)

	return (
		<div className="max-w-xs flex flex-col gap-10">
			<TimePicker
				label={args.label}
				defaultValue={args.defaultValue}
				onChange={(e) => setTime(e)}
			/>

			<p className="text-sm text-gray-500">Time: {time?.toString()}</p>
		</div>
	)
}

const meta: Meta<typeof TimePicker> = {
	title: 'Inputs/TimePicker',
	render: ({ ...args }) => <TimePickerDemo args={args} />,
	args: {
		label: 'Time Picker',
		defaultValue: new Time(11, 0, 0),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const timePicker = canvas.getByTestId('timepicker')
		await expect(timePicker).toBeInTheDocument()
		await expect(timePicker).toHaveAccessibleName(args.label)
		await expect(timePicker).toHaveAccessibleDescription('Selected Time: 11:00 AM')

		const hourInput = canvas.getByRole('spinbutton', { name: /hour/ })
		await expect(hourInput).toBeInTheDocument()
		await expect(hourInput).toHaveAccessibleName(/hour/)

		const minuteInput = canvas.getByRole('spinbutton', { name: /minute/ })
		await expect(minuteInput).toBeInTheDocument()
		await expect(minuteInput).toHaveAccessibleName(/minute/)

		const amPmInput = canvas.getByRole('spinbutton', { name: /AM\/PM/ })
		await expect(amPmInput).toBeInTheDocument()
		await expect(amPmInput).toHaveAccessibleName(/AM\/PM/)

		await expect(hourInput).toHaveValue(args.defaultValue?.hour)
		await expect(minuteInput).toHaveValue(args.defaultValue?.minute)
		await expect(amPmInput).toHaveValue(args.defaultValue?.second) //0 for AM, 12 for PM

		await userEvent.click(hourInput)
		await userEvent.keyboard('4')

		await userEvent.click(minuteInput)
		await userEvent.keyboard('35')

		await userEvent.click(amPmInput)
		await userEvent.keyboard('PM')

		await expect(hourInput).toHaveValue(16)
		await expect(minuteInput).toHaveValue(35)
		await expect(amPmInput).toHaveValue(12)
	},
}

export default meta

type Story = StoryObj<typeof TimePicker>

export const Default: Story = {}
