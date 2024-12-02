import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/buttons/Button'
import { Form } from '@/forms/Form'
import {
	PasswordField,
	PasswordFieldSchema,
	PasswordFieldSchemaForStrengthIndicator,
	PasswordFieldSchemaSignIn,
} from '@/forms/fields/PasswordField'
import { PasswordStrengthIndicator } from '@/components/forms/patterns/PasswordStrengthIndicator'
import { TextInputField } from '@/forms/fields/TextInputField'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { screen, userEvent, within, waitFor, expect } from '@storybook/test'

// ------------------------------------- Default story

const PasswordFormSchema = z.object({
	password: PasswordFieldSchema,
})

const onSubmit = (data: z.infer<typeof PasswordFormSchema>) => {
	console.log(JSON.stringify(data, null, 2))
	addToastToQueue({
		title: 'You submitted the following values:',
		description: <JsonCodeBlockDisplay data={data} />,
	})
}

const PasswordFieldDemo = () => {
	const form = useForm<z.infer<typeof PasswordFormSchema>>({
		resolver: zodResolver(PasswordFormSchema),
	})

	return (
		<div className="max-w-sm">
			<Form formMethods={form} formName="password form" onSubmit={onSubmit}>
				<PasswordField
					id="password"
					name="password"
					label="Password"
					control={form.control}
					autoComplete="current-password"
				/>
				<Button type="submit" className="mt-4">
					Submit
				</Button>
			</Form>
			<GlobalToastRegion />
		</div>
	)
}

const meta: Meta<typeof PasswordFieldDemo> = {
	title: 'Forms/Fields/PasswordField',
	render: () => <PasswordFieldDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		// only run for default password field story
		if (!canvas.queryByLabelText('Password') || canvas.queryByLabelText('Email or username')) {
			return
		}

		const passwordField = canvas.getByLabelText('Password')
		await expect(passwordField).toBeInTheDocument()
		await expect(passwordField).toHaveAccessibleName()
		await expect(passwordField).toBeRequired() //default
		await userEvent.click(passwordField)
		await userEvent.type(passwordField, 'ab', { delay: 50 })
		await expect(passwordField).toHaveValue('ab')

		const submit = canvas.getByRole('button', { name: 'Submit' })
		await userEvent.click(submit)
		await waitFor(() =>
			expect(canvas.getByText('Password must contain at least one capital letter.')).toBeVisible()
		)

		await userEvent.click(passwordField)
		await userEvent.type(passwordField, '12A', { delay: 50 })
		await expect(passwordField).toHaveValue('ab12A')
		await userEvent.click(submit)

		await waitFor(() =>
			expect(canvas.getByText('Password must contain at least one symbol.')).toBeVisible()
		)

		await userEvent.click(passwordField)
		await userEvent.type(passwordField, '!@', { delay: 50 })
		await expect(passwordField).toHaveValue('ab12A!@')
		await userEvent.click(submit)

		await waitFor(() =>
			expect(canvas.getByText('Password must be at least 8 characters long.')).toBeVisible()
		)

		await userEvent.click(passwordField)
		await userEvent.type(passwordField, '8', { delay: 50 })
		await expect(passwordField).toHaveValue('ab12A!@8')
		await userEvent.click(submit)

		await expect(
			screen.getByRole('alertdialog', {
				name: 'You submitted the following values:',
			})
		).toBeVisible()
		const dismissToast = screen.getByRole('button', { name: 'Dismiss' })
		await userEvent.click(dismissToast)

		await waitFor(() => expect(canvas.queryByText(/Password must/i)).not.toBeInTheDocument())

		await expect(passwordField).toHaveAttribute('type', 'password')
		expect(canvas.queryByText('ab12A!@8')).not.toBeInTheDocument()

		await userEvent.type(passwordField, ' ', { delay: 50 })
		await expect(canvas.getByText('Password must not contain spaces.')).toBeInTheDocument()
		await userEvent.keyboard('{Backspace}')

		const eyeBtn = canvas.getByRole('button', {
			name: 'show password',
		})
		await userEvent.click(eyeBtn)
		await expect(passwordField).toHaveAttribute('type', 'text')
		await expect(passwordField).toHaveValue('ab12A!@8')
		await userEvent.click(eyeBtn)
		await expect(passwordField).toHaveAttribute('type', 'password')
		await expect(passwordField).toHaveValue('ab12A!@8')
		eyeBtn.blur()
	},
}

export default meta

type Story = StoryObj<typeof PasswordFieldDemo>

export const Default: Story = {}

// ------------------------------------- Change password demo story

const ChangePasswordFormSchema = z
	.object({
		new_password: PasswordFieldSchemaForStrengthIndicator,
		confirm_password: z.string(),
	})
	.superRefine((values, refinementContext) => {
		if (values.new_password !== values.confirm_password) {
			return refinementContext.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['confirm_password'],
				message: 'Passwords do not match.',
			})
		}
	})

const ChangePasswordDemo = () => {
	const form = useForm({
		resolver: zodResolver(ChangePasswordFormSchema),
		defaultValues: {
			new_password: '',
			confirm_password: '',
		},
	})

	const onSubmit = (data: z.infer<typeof ChangePasswordFormSchema>) => {
		addToastToQueue({
			title: 'You submitted the following values:',
			description: <JsonCodeBlockDisplay data={data} />,
		})
	}

	return (
		<div className="max-w-sm flex flex-col gap-4">
			<Form
				formMethods={form}
				formName="New password form"
				onSubmit={onSubmit}
				className="flex flex-col gap-4"
			>
				<PasswordField
					id="new_password"
					name="new_password"
					label="New password"
					control={form.control}
					autoComplete="off"
					isCreateOrChangeField
				/>

				<PasswordStrengthIndicator password={form.watch('new_password')} />

				<PasswordField
					id="confirm_password"
					name="confirm_password"
					label="Confirm password"
					control={form.control}
					autoComplete="off"
				/>

				<Button type="submit">Submit</Button>
			</Form>

			<GlobalToastRegion />
		</div>
	)
}

export const ChangePassword: Meta<typeof ChangePasswordDemo> = {
	title: 'Forms/Fields/PasswordField',
	render: () => <ChangePasswordDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		// only run for the change password field story
		if (!(canvas.queryByLabelText('New password') && canvas.queryByLabelText('Confirm password'))) {
			return
		}

		const newPasswordField = canvas.getByLabelText('New password')
		await expect(newPasswordField).toBeInTheDocument()
		await expect(newPasswordField).toHaveAccessibleName()
		await expect(newPasswordField).toBeRequired() //default
		await userEvent.click(newPasswordField)
		await userEvent.type(newPasswordField, 'StrongPa$$1', { delay: 50 })
		await expect(newPasswordField).toHaveValue('StrongPa$$1')

		const submit = canvas.getByRole('button', { name: 'Submit' })
		await userEvent.click(submit)
		const errorMsg = 'Passwords do not match.'
		await waitFor(() => expect(canvas.getByText(errorMsg)).toBeVisible())

		const confirmPasswordField = canvas.getByLabelText('Confirm password')
		await expect(confirmPasswordField).toBeInTheDocument()
		await expect(confirmPasswordField).toHaveAccessibleName()
		await expect(confirmPasswordField).toBeRequired() //default
		await userEvent.click(confirmPasswordField)
		await userEvent.type(confirmPasswordField, 'StrongPa$$1', { delay: 50 })
		await expect(confirmPasswordField).toHaveValue('StrongPa$$1')

		//tests password form submission on Enter key on the last input field
		await userEvent.type(confirmPasswordField, '{Enter}', { delay: 50 })
	},
}

// ------------------------------------- Sign-in demo story

const SignInFormSchema = z.object({
	email_username: z.string().min(1, { message: 'Enter a valid email or username.' }),
	password: PasswordFieldSchemaSignIn,
})

const SignInDemo = () => {
	const form = useForm({
		resolver: zodResolver(SignInFormSchema),
		defaultValues: {
			email_username: '',
			password: '',
		},
	})

	const onSubmit = (data: z.infer<typeof SignInFormSchema>) => {
		addToastToQueue({
			title: 'You submitted the following values:',
			description: <JsonCodeBlockDisplay data={data} />,
		})
	}

	return (
		<div className="max-w-sm flex flex-col gap-4">
			<Form
				formMethods={form}
				formName="Sign-in form"
				onSubmit={onSubmit}
				className="flex flex-col gap-4"
			>
				<TextInputField
					id="email-or-username"
					name="email_username"
					label="Email or username"
					control={form.control}
					autoComplete="email"
				/>
				<PasswordField
					id="password"
					name="password"
					label="Password"
					control={form.control}
					autoComplete="off"
				/>

				<Button type="submit">Submit</Button>
			</Form>

			<GlobalToastRegion />
		</div>
	)
}

export const SignIn: Meta<typeof SignInDemo> = {
	title: 'Forms/Fields/PasswordField',
	render: () => <SignInDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)

		// only run for the sign-in story
		if (!(canvas.queryByLabelText('Email or username') && canvas.queryByLabelText('Password'))) {
			return
		}

		const submit = canvas.getByRole('button', { name: 'Submit' })
		await userEvent.hover(submit) //story is a bit glitchy - using an extra userEvent to delay assertion
		await userEvent.click(submit)
		const emailErrorMsg = 'Enter a valid email or username.'
		await waitFor(() => expect(canvas.getByText(emailErrorMsg)).toBeVisible())
		const passwordErrorMsg = 'Enter a valid password.'
		await waitFor(() => expect(canvas.getByText(passwordErrorMsg)).toBeVisible())

		const emailField = canvas.getByLabelText('Email or username')
		await expect(emailField).toBeInTheDocument()
		await expect(emailField).toHaveAccessibleName()
		await expect(emailField).toBeRequired() //default
		await userEvent.click(emailField)
		await userEvent.type(emailField, 'MyUsername', { delay: 50 })
		await expect(emailField).toHaveValue('MyUsername')

		const passwordField = canvas.getByLabelText('Password')
		await expect(passwordField).toBeInTheDocument()
		await expect(passwordField).toHaveAccessibleName()
		await expect(passwordField).toBeRequired() //default
		await userEvent.click(passwordField)
		await userEvent.type(passwordField, 'StrongPa$$1', { delay: 50 })
		await expect(passwordField).toHaveValue('StrongPa$$1')

		await userEvent.click(submit)
	},
}
