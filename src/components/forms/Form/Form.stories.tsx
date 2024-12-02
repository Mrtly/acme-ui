import React, { useCallback, useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '@/forms/Form'
import { Button } from '@/components/buttons/Button'
import { CheckboxField } from '@/forms/fields/CheckboxField'
import { CheckboxCardField } from '@/forms/fields/CheckboxCardField'
import { DatePickerField } from '@/forms/fields/DatePickerField'
import { RadioGroupField, RadioGroupFieldItem } from '@/forms/fields/RadioGroupField'
import { RadioCardGroupField, RadioCardGroupFieldItem } from '@/forms/fields/RadioCardGroupField'
import { TextInputField } from '@/forms/fields/TextInputField'
import { SelectField, SelectFieldItem } from '@/forms/fields/SelectField'
import { TextareaField } from '@/forms/fields/TextareaField'
import { SwitchField } from '@/forms/fields/SwitchField'
import { ComboboxField, ComboboxFieldItem, ComboboxFieldSection } from '../fields/ComboboxField'
import { MaskedInputAccountSchema, MaskedInputField } from '../fields/MaskedInputField'
import { MaskedSsnField, MaskedSsnFieldSchema } from '../fields/MaskedSsnField'
import { PasswordField, PasswordFieldSchema } from '../fields/PasswordField'
import { SelectFieldOptions } from '../fields/SelectFieldOptions'
import { UploadField } from '../fields/UploadField'
import { EmailField, EmailFieldSchema } from '../fields/EmailField'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { userEvent, screen, within, waitFor, expect } from '@storybook/test'

const FormSchema = z.object({
	first_name: z
		.string({
			required_error: 'Enter a valid name.',
		})
		.min(2, {
			message: 'Name should be more than two characters.',
		}),
	test_checkbox: z.boolean().refine((v) => v === true, {
		message: 'This checkbox is required.',
	}),
	test_radiogroup: z.enum(['dog', 'cat', 'fish'], {
		required_error: 'Pet selection is required.',
	}),
	test_radiocardGroup: z.enum(['dog', 'cat', 'fish'], {
		required_error: 'Pet selection is required.',
	}),
	test_select: z.string({
		required_error: 'Select an option.',
	}),
	message: z.string({
		required_error: 'Enter a message.',
	}),
	paperless: z.boolean().optional(),
})

const onSubmit = (data: z.infer<typeof FormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const FormDemo1 = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			first_name: '',
		},
	})

	return (
		<div className="max-w-md rounded-lg border mx-auto p-6">
			<Form
				formMethods={form}
				formName="Main Form"
				onSubmit={onSubmit}
				className="flex flex-col gap-8"
			>
				<TextInputField
					id="first-name"
					type="text"
					control={form.control}
					name="first_name"
					label="First Name"
					placeholder="First name"
					description="Your first name."
				/>
				<CheckboxCardField
					id="test-checkbox"
					control={form.control}
					name="test_checkbox"
					label="This is my test checkbox card"
					description="Praesent commodo cursus magna, vel scelerisque nisl consectetur et."
				/>
				<RadioGroupField
					control={form.control}
					name="test_radiogroup"
					legend="This is my test RadioGroup"
					description="Praesent commodo cursus magna, vel scelerisque nisl consectetur et."
				>
					<RadioGroupFieldItem id="dog" label="Dog" value="dog" />
					<RadioGroupFieldItem id="cat" label="Cat" value="cat" />
					<RadioGroupFieldItem id="fish" label="Fish" value="fish" />
				</RadioGroupField>
				<RadioCardGroupField
					control={form.control}
					name="test_radiocardGroup"
					legend="This is my test RadioCardGroup"
					description="Praesent commodo cursus magna, vel scelerisque nisl consectetur et."
				>
					<RadioCardGroupFieldItem
						id="dog2"
						label="Dog"
						value="dog"
						description="Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum."
					/>
					<RadioCardGroupFieldItem
						id="cat2"
						label="Cat"
						value="cat"
						description="Sed posuere consectetur est at lobortis."
					/>
					<RadioCardGroupFieldItem
						id="fish2"
						label="Fish"
						value="fish"
						description="Morbi leo risus, porta ac consectetur ac, vestibulum at eros."
					/>
				</RadioCardGroupField>
				<SelectField
					control={form.control}
					name="test_select"
					id="test-select"
					label="Select an option"
					description="This is a select field"
					placeholder="Make a selection"
				>
					<SelectFieldItem value="option1">Option 1</SelectFieldItem>
					<SelectFieldItem value="option2">Option 2</SelectFieldItem>
					<SelectFieldItem value="option3">Option 3</SelectFieldItem>
				</SelectField>
				<TextareaField
					id="message"
					label="Your message"
					name="message"
					placeholder="Add your message here"
					description="Add your message"
					control={form.control}
				/>
				<SwitchField
					id="paperless"
					label="Paperless setting"
					name="paperless"
					description="Opt out of paper mail and access your documents online."
					control={form.control}
				/>
				<div>
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof FormDemo1> = {
	title: 'Forms/Form',
	render: () => <FormDemo1 />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const form = canvas.queryByRole('form', { name: 'Main Form' })
		//only run for main demo
		if (form) {
			expect(form).toBeInTheDocument()
			// text input
			const firstName = canvas.getByLabelText('First Name')
			expect(firstName).toBeVisible()
			expect(firstName).toBeRequired()
			expect(firstName).toHaveValue('')
			await userEvent.type(firstName, 'A', { delay: 50 })
			expect(firstName).toHaveValue('A')
			await userEvent.clear(firstName)
			expect(firstName).toHaveValue('')

			//checkbox card
			const checkboxCard = canvas.getByRole('checkbox', {
				name: new RegExp('This is my test checkbox card', 'i'),
			})
			expect(checkboxCard).toHaveAccessibleName()
			await userEvent.click(checkboxCard)
			expect(checkboxCard).toBeChecked()
			await userEvent.click(checkboxCard)

			// radiogroup
			const radioGroup = canvas.getByRole('radiogroup', {
				name: 'This is my test RadioGroup',
			})
			expect(radioGroup).toHaveAccessibleName()
			expect(radioGroup).toHaveAccessibleDescription()
			expect(radioGroup).toBeRequired()
			// radiocardGroup
			const radioCardGroup = canvas.getByRole('radiogroup', {
				name: 'This is my test RadioCardGroup',
			})
			expect(radioCardGroup).toHaveAccessibleName()
			expect(radioCardGroup).toHaveAccessibleDescription()
			expect(radioCardGroup).toBeRequired()
			// select
			const select = canvas.getByLabelText('Select an option')
			expect(select).toBeVisible()
			expect(select).toHaveAccessibleName()
			expect(select).toHaveAccessibleDescription()
			expect(select.parentElement).toHaveAttribute('data-required', 'true')
			// TODO: more tests needed for select component
			// form submit
			const submit = canvas.getByRole('button', { name: 'Submit' })
			expect(submit).toBeEnabled()
			// test submission
			await userEvent.click(submit) //submit empty form, expect error messages
			await waitFor(async () => {
				expect(canvas.getByText('Name should be more than two characters.')).toBeVisible()
			})
			await userEvent.type(firstName, 'Abc', { delay: 50 })

			expect(canvas.queryByText('Name should be more than two characters.')).not.toBeInTheDocument()
			await userEvent.click(checkboxCard)
			await userEvent.click(canvas.getAllByLabelText('Cat')[0])
			await userEvent.click(canvas.getAllByLabelText('Cat')[1])
			await userEvent.click(select)
			const option1 = await screen.findByRole('option', { name: 'Option 1' })
			expect(option1).toHaveAccessibleName()
			await userEvent.click(option1) //bug in new storybook/test ?
			await userEvent.click(option1) //double click on select option in testing suite

			const textarea = canvas.getByLabelText('Your message')
			expect(textarea).toBeRequired()
			await userEvent.type(textarea, 'my message', { delay: 50 })

			// submit completed form, expect toast
			await userEvent.click(submit)
			expect(
				screen.getByRole('alertdialog', {
					name: 'You submitted the following values:',
				})
			).toBeVisible()
		}
	},
}

export default meta

export const FormDemo: StoryObj = {}

// ---------------------------------------------

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const FormSchema2 = z.object({
	'date-picker': z.date({
		required_error: 'Pick a date.',
	}),
	'account-number': MaskedInputAccountSchema,
	ssn: MaskedSsnFieldSchema,
	password: PasswordFieldSchema,
	state: z.string({
		required_error: 'Select a state.',
	}),
	file: z
		.custom<File>((file) => file, {
			message: 'An image file is required.',
		})
		.refine((file) => file && file?.size <= 5000000, `Max image size is 5MB.`)
		.refine(
			(file) => file && ACCEPTED_IMAGE_TYPES.includes(file?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.'
		)
		.optional(),
	combobox: z
		.string({
			required_error: 'Select an option.',
		})
		//important, value must not be ""
		.refine((data) => data.trim() !== '', {
			message: 'Select a flavor.',
		}),
})

const onSubmit2 = (data: z.infer<typeof FormSchema2>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const FormDemo2Comp = () => {
	const form2 = useForm<z.infer<typeof FormSchema2>>({
		resolver: zodResolver(FormSchema2),
		defaultValues: {
			'account-number': '',
			ssn: '',
			password: '',
			combobox: '',
		},
	})

	// the below handles validation from inside the DatePickerField for unavailable dates
	const [datepickerError, setDatepickerError] = useState<string | null>(null)

	const setErrorMessage = useCallback(
		(msg: string) => {
			form2.setError('date-picker', {
				type: 'custom',
				message: msg,
			})
		},
		[form2]
	)

	useEffect(() => {
		datepickerError ? setErrorMessage(datepickerError) : form2.clearErrors('date-picker')
	}, [form2, datepickerError, setErrorMessage])

	const handleSubmit = async (data: z.infer<typeof FormSchema2>) => {
		if (datepickerError) {
			//set the error message again because RHF removes it
			setErrorMessage(datepickerError)
			// focus on the first invalid field
			const firstErrorField = Object.keys(form2.formState.errors)[0]
			// @ts-expect-error (ref possibly undefined)
			const fieldRef = form2.control._fields?.[firstErrorField]?._f.ref
			fieldRef && fieldRef.focus()
		} else {
			onSubmit2(data) //proceed to submission
		}
	}

	return (
		<div className="max-w-sm rounded-lg border mx-auto p-6">
			<Form
				formMethods={form2}
				formName="Second Form"
				onSubmit={handleSubmit}
				className="flex flex-col gap-4"
			>
				{/* MaskedInputField */}
				<MaskedInputField
					control={form2.control}
					id="accnum"
					name="account-number"
					label="Account number"
					maskType="account"
					description="16-digit account number"
					placeholder="xxxx-xxxx-xxxx-xxxx"
					required
				/>
				{/* MaskedSsnField */}
				<MaskedSsnField
					control={form2.control}
					id="ssn"
					name="ssn"
					label="Social Security Number"
					description="Your SSN"
					placeholder="000-00-0000"
					required
				/>
				{/* PasswordField */}
				<PasswordField
					control={form2.control}
					id="password"
					name="password"
					label="Password"
					description="Enter your password"
					autoComplete="current-password"
				/>

				{/* ComboboxField */}
				<ComboboxField
					control={form2.control}
					name="combobox"
					id="combobox"
					label="Ice cream flavor"
					description="Select your ice cream flavor"
					placeholder="Start typing..."
				>
					<ComboboxFieldItem value="vanilla">Vanilla</ComboboxFieldItem>
					<ComboboxFieldItem value="chocolate">Chocolate</ComboboxFieldItem>
					<ComboboxFieldItem value="mint">Mint</ComboboxFieldItem>
					<ComboboxFieldItem value="strawberry">Strawberry</ComboboxFieldItem>
					<ComboboxFieldSection title="Sorbet">
						<ComboboxFieldItem value="lemon">Lemon Sorbet</ComboboxFieldItem>
					</ComboboxFieldSection>
				</ComboboxField>

				{/* SelectFieldOptions */}
				<SelectFieldOptions
					options="state"
					control={form2.control}
					name="state"
					id="state"
					label="State"
					description="Select your state"
					stateValueDisplayed="abbreviation"
					required
				/>
				{/* UploadField */}
				<UploadField
					control={form2.control}
					filetype="image"
					name="file"
					id="file"
					accept="image/png,image/jpg,image/jpeg,image/webp"
					label="Upload your avatar"
					description="Click to select your image file"
					showPreview={true}
				/>

				{/* DatePickerField */}
				<DatePickerField
					id="date-picker"
					control={form2.control}
					name="date-picker"
					label="Select a date"
					description="Set a date for your appointment"
					handleFieldError={setDatepickerError}
					disableWeekends
				/>

				<div>
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

export const FormDemo2 = {
	title: 'Forms/Form',
	render: () => <FormDemo2Comp />,
	// @ts-expect-error implicit any type
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const form = canvas.queryByRole('form', { name: 'Second Form' })
		//only run for second demo
		if (form) {
			expect(form).toBeInTheDocument()
			//acc number
			const accNumField = canvas.getByLabelText('Account number')
			await userEvent.type(accNumField, '1234567812345678', { delay: 50 })

			//ssn number
			const ssnNumField = canvas.getByLabelText('Social Security Number')
			await userEvent.type(ssnNumField, '1234567890', { delay: 50 })

			//password
			const passwordField = canvas.getByLabelText('Password')
			await userEvent.type(passwordField, '11AAaa!!@@', { delay: 50 })

			//combobox
			const combobox = canvas.getByRole('combobox', {
				name: 'Ice cream flavor',
			})
			await userEvent.click(combobox)
			await userEvent.keyboard('[ArrowDown]')
			let listbox = screen.getByRole('listbox')
			await waitFor(() => {
				listbox = screen.getByRole('listbox')
				expect(listbox).toBeVisible()
			})
			const vanilla = within(listbox!).getByRole('option', { name: 'Vanilla' })
			await userEvent.click(vanilla)

			//US state
			const stateField = canvas.getByLabelText('State')
			expect(stateField).toBeInTheDocument()
			expect(stateField).toBeVisible()
			expect(stateField).toHaveAccessibleName()
			await userEvent.click(stateField)
			const optionColorado = screen.getByRole('option', { name: 'Colorado' })
			await userEvent.click(optionColorado)
			await userEvent.click(optionColorado) //buggy suite needs double click? remove later
			await waitFor(() => {
				expect(stateField).toHaveAttribute('aria-expanded', 'false')
				expect(canvas.getAllByText('CO')[0]).toBeVisible() //the selected value displayed
				expect(stateField).toHaveTextContent('CO')
			})

			// date picker
			const datepicker = canvas.getByTestId('datepicker')
			expect(datepicker).toBeInTheDocument()
			expect(datepicker).toBeVisible()
			expect(datepicker).toHaveAccessibleName()
			expect(datepicker).toHaveAccessibleDescription()
			//is required
			const dateInputs = canvas.getAllByRole('spinbutton')
			expect(dateInputs[0]).toHaveAttribute('aria-required', 'true')
			//open calendar
			const calendarBtn = canvas.getByRole('button', {
				name: 'Calendar Select a date',
			})
			await userEvent.click(calendarBtn)
			await userEvent.unhover(calendarBtn)
			const calendar = screen.getByRole('application', {
				name: /select a date/i,
			})
			expect(calendar).toBeInTheDocument()
			//pick date
			const today = new Date()
			const testDates = within(calendar).getAllByRole('gridcell', {
				name: today.getDate().toString(),
			})
			const button = within(testDates[0]).getByRole('button')
			const ariaLabel = await button.getAttribute('aria-label')
			//in case the a calendar date appears twice but one of them is disabled (date is of prev/next month)
			const testDate = ariaLabel?.includes('Today') ? testDates[0] : testDates[1]

			expect(testDate).not.toHaveAttribute('aria-selected')
			await userEvent.click(within(testDate).getByRole('button'))
			expect(testDate).toHaveAttribute('aria-selected', 'true')

			//close calendar
			await userEvent.keyboard('{Escape}')
		}
	},
}

// --------------------------------------------- Simple Demo for Form docs

const FormSchema3 = z.object({
	email: EmailFieldSchema,
	subscribed: z.boolean().refine((v) => v === true, {
		message: 'Required.',
	}),
})

const onSubmit3 = (data: z.infer<typeof FormSchema3>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const FormDemo3Comp = () => {
	const form3 = useForm<z.infer<typeof FormSchema3>>({
		resolver: zodResolver(FormSchema3),
		defaultValues: {
			email: '',
		},
	})

	return (
		<div className="max-w-lg rounded-lg border mx-auto p-6">
			<Form
				formMethods={form3}
				formName="Email Form"
				onSubmit={onSubmit3}
				className="flex flex-col gap-4"
			>
				<EmailField id="email" control={form3.control} name="email" label="Your email" />
				<CheckboxField
					id="check"
					control={form3.control}
					name="subscribed"
					label="Subscribe to our newsletter"
					description="You can unsubscribe anytime"
				/>
				<div>
					<Button type="submit">Submit</Button>
				</div>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

export const FormDemo3 = {
	title: 'Forms/Form',
	render: () => <FormDemo3Comp />,
	// @ts-expect-error implicit any type
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const form = canvas.queryByRole('form', { name: 'Email Form' })
		//only run for email form demo
		if (form) {
			expect(form).toBeInTheDocument()
			// email
			const emailField = canvas.getByLabelText('Your email')
			expect(emailField).toBeInTheDocument()

			await userEvent.type(emailField, 'Abc@example.com', { delay: 50 })
			expect(emailField).toHaveValue('Abc@example.com')
			// checkbox
			const checkbox = canvas.getByLabelText('Subscribe to our newsletter')
			userEvent.click(checkbox)
		}
	},
}
