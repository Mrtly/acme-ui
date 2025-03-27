import type { Meta, StoryObj } from '@storybook/react'
import { addToastToQueue, GlobalToastRegion } from '@/components/notifications/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { TimePickerField, TimePickerFieldSchema } from './TimePickerField'
import { Button, Form } from 'src'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { within, expect, userEvent } from '@storybook/test'

const FormSchema = z.object({
	time_picker: TimePickerFieldSchema,
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const Demo = (args: StoryObj<typeof TimePickerField>) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		// defaultValues: {
		// 	time_picker: {
		// 		hour: 20,
		// 		minute: 30,
		// 	},
		// },
	})

	return (
		<div className="max-w-sm">
			<Form formMethods={form} formName="text input form" onSubmit={onSubmit}>
				<TimePickerField
					{...args}
					control={form.control}
					name="time_picker"
					label="Time Picker"
					description="This is a description"
				/>

				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta = {
	title: 'Forms/Fields/TimePickerField',
	render: (args) => <Demo {...args} />,
	args: {
		label: 'Time Picker',
		description: 'This is a description',
		srOnlyLabel: false,
		srOnlyDescription: false,
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const timePicker = canvas.getByTestId('timepicker')
		await expect(timePicker).toBeInTheDocument()
		await expect(timePicker).toHaveAccessibleName(args.label)

		const hourInput = canvas.getByRole('spinbutton', { name: /hour/ })
		const minuteInput = canvas.getByRole('spinbutton', { name: /minute/ })
		const amPmInput = canvas.getByRole('spinbutton', { name: /AM\/PM/ })

		await userEvent.type(hourInput, '4')
		await userEvent.type(minuteInput, '35')
		await userEvent.type(amPmInput, 'PM')

		await expect(hourInput).toHaveValue(16)
		await expect(minuteInput).toHaveValue(35)
		await expect(amPmInput).toHaveValue(12)
		await expect(timePicker).toHaveAccessibleDescription(`Selected Time: 4:35 PM`)

		await userEvent.click(canvas.getByRole('button', { name: 'Submit' }))
	},
}

export default meta

export const Default: StoryObj = {}
