import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioChipGroup, RadioChipGroupSection, RadioChip } from './RadioChipGroup'
import { expect, within } from '@storybook/test'

const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
const theNextDay = new Date()
theNextDay.setDate(theNextDay.getDate() + 2)
const theDayAfterNext = new Date()
theDayAfterNext.setDate(theDayAfterNext.getDate() + 3)

const tomorrowAppointments = [
	`${tomorrow.toDateString()}, 8 a.m. - 4 p.m.`,
	`${tomorrow.toDateString()}, 8 a.m. - 12 p.m.`,
	`${tomorrow.toDateString()}, 12 p.m. - 4 p.m.`,
]

const theNextDayAppointments = [
	`${theNextDay.toDateString()}, 8 a.m. - 4 p.m.`,
	`${theNextDay.toDateString()}, 8 a.m. - 12 p.m.`,
	`${theNextDay.toDateString()}, 12 p.m. - 4 p.m.`,
]

const theDayAfterNextAppointments = [`${theDayAfterNext.toDateString()}, 12 p.m. - 4 p.m.`]

const getLabel = (appt: string) => {
	return appt.split(',')[1]
}

const StoryDemo = ({ disabled, srOnlyLegend }: { disabled?: boolean; srOnlyLegend?: boolean }) => {
	return (
		<div className="max-w-sm">
			<RadioChipGroup
				name="appointment_times"
				legend="Select an appointment to start service"
				defaultValue={tomorrowAppointments[0]}
				disabled={disabled}
				srOnlyLegend={srOnlyLegend}
				onValueChange={(v) => console.log(v)}
			>
				<RadioChipGroupSection label={tomorrow.toDateString()}>
					{tomorrowAppointments.map((appointment) => (
						<RadioChip
							key={appointment}
							id={appointment}
							value={appointment}
							label={getLabel(appointment)}
							iconName="Clock"
						/>
					))}
				</RadioChipGroupSection>
				<RadioChipGroupSection label={theNextDay.toDateString()}>
					{theNextDayAppointments.map((appointment) => (
						<RadioChip
							key={appointment}
							id={appointment}
							value={appointment}
							label={getLabel(appointment)}
							iconName="Clock"
						/>
					))}
				</RadioChipGroupSection>
				<RadioChipGroupSection label={theDayAfterNext.toDateString()}>
					{theDayAfterNextAppointments.map((appointment) => (
						<RadioChip
							key={appointment}
							id={appointment}
							value={appointment}
							label={getLabel(appointment)}
							iconName="Clock"
						/>
					))}
				</RadioChipGroupSection>
			</RadioChipGroup>
		</div>
	)
}

const meta: Meta<typeof RadioChipGroup> = {
	title: 'Forms/Inputs/RadioChipGroup',
	render: ({ ...args }) => <StoryDemo disabled={args.disabled} srOnlyLegend={args.srOnlyLegend} />,
	args: { disabled: false, srOnlyLegend: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const RadioChipGroupRadioGroup = canvas.getByRole('radiogroup', {
			name: 'Select an appointment to start service',
		})
		await expect(RadioChipGroupRadioGroup).toBeInTheDocument()
		await expect(RadioChipGroupRadioGroup).toHaveAccessibleName()

		const chipRadio = within(RadioChipGroupRadioGroup).getAllByRole('radio', {
			name: /8 a.m. - 4 p.m./i,
		})[0]
		await expect(chipRadio).toBeInTheDocument()
		await expect(chipRadio).toHaveAccessibleName()
		await expect(chipRadio).toBeChecked() //default value
	},
}

export default meta

type Story = StoryObj<typeof RadioChipGroup>

export const Default: Story = {}
