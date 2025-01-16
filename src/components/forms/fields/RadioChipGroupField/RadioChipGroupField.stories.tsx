import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { Button } from '@/components/buttons/Button'
import {
	RadioChipGroupField,
	RadioChipGroupFieldSection,
	RadioChipGroupFieldItem,
} from './RadioChipGroupField'
import { within, expect, userEvent } from '@storybook/test'

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
	return appt.split(', ')[1]
}

const FormSchema = z.object({
	appointment_times: z.string({
		required_error: 'Pick an appointment time.',
	}),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const RadioChipGroupFieldDemo = ({
	disabled,
	srOnlyLegend,
	description,
	srOnlyDescription,
}: {
	disabled?: boolean
	srOnlyLegend?: boolean
	description?: string
	srOnlyDescription?: boolean
}) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div className="max-w-sm">
			<Form
				formMethods={form}
				formName="ChipRadio group form"
				onSubmit={onSubmit}
				className="flex flex-col gap-9"
			>
				<div className="max-w-sm">
					<RadioChipGroupField
						control={form.control}
						name="appointment_times"
						legend="Select an appointment to start service"
						disabled={disabled}
						srOnlyLegend={srOnlyLegend}
						description={description}
						srOnlyDescription={srOnlyDescription}
					>
						<RadioChipGroupFieldSection label={tomorrow.toDateString()}>
							{tomorrowAppointments.map((appointment) => (
								<RadioChipGroupFieldItem
									iconName="Clock"
									key={appointment}
									value={appointment}
									label={getLabel(appointment)}
								/>
							))}
						</RadioChipGroupFieldSection>
						<RadioChipGroupFieldSection label={theNextDay.toDateString()}>
							{theNextDayAppointments.map((appointment) => (
								<RadioChipGroupFieldItem
									iconName="Clock"
									key={appointment}
									value={appointment}
									label={getLabel(appointment)}
								/>
							))}
						</RadioChipGroupFieldSection>
						<RadioChipGroupFieldSection label={theDayAfterNext.toDateString()}>
							{theDayAfterNextAppointments.map((appointment) => (
								<RadioChipGroupFieldItem
									iconName="Clock"
									key={appointment}
									value={appointment}
									label={getLabel(appointment)}
									disabled
								/>
							))}
						</RadioChipGroupFieldSection>
					</RadioChipGroupField>
				</div>
				<Button variant="primary" size="md" type="submit" className="mt-4 w-min">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof RadioChipGroupFieldDemo> = {
	title: 'Forms/Fields/RadioChipGroupField',
	render: ({ ...args }) => (
		<RadioChipGroupFieldDemo
			disabled={args.disabled}
			description={args.description}
			srOnlyDescription={args.srOnlyDescription}
			srOnlyLegend={args.srOnlyLegend}
		/>
	),
	args: {
		disabled: false,
		srOnlyLegend: false,
		description: 'The field description',
		srOnlyDescription: false,
	},
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
		expect(chipRadio).not.toBeChecked()
		await userEvent.click(chipRadio)
		await expect(chipRadio).toBeChecked()
	},
}

export default meta

type Story = StoryObj<typeof RadioChipGroupFieldDemo>

export const Default: Story = {}
