import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Step, StepConfig, Stepper, StepperControlsArea } from './Stepper'
import { useStepper } from './useStepper'
import { Button } from '@/components/buttons/Button'
import { Icon } from '@/theme/Icons'
import { userEvent, within, expect } from '@storybook/test'

const steps = [
	{ label: 'Step 1', description: 'a description' },
	{
		label: 'Step 2',
		description: 'this is a longer description with some more wordy words',
	},
	{
		label: 'Step 3',
		description: 'this is an optional step',
		optional: true,
		optionalLabel: 'optional',
		icon: <Icon name="Circle" size="md" />,
	},
	{ label: 'Step 4' },
] satisfies StepConfig[]

const StepperDemo = ({
	orientation,
	labelOrientation,
	enableAllSteps,
}: {
	orientation?: 'horizontal' | 'vertical'
	labelOrientation?: 'horizontal' | 'vertical'
	enableAllSteps?: boolean
}) => {
	const {
		nextStep,
		prevStep,
		resetSteps,
		setStep,
		completeAndNextStep,
		activeStep,
		isDisabledStep,
		isLastStep,
		isStepperFinished,
		isOptionalStep,
		isStepCompleted,
	} = useStepper({
		initialStep: 0,
		steps,
	})

	const onClickStep = (i: number) => {
		setStep(i)
	}

	const handleNext = () => {
		completeAndNextStep()
	}

	const handleReset = () => {
		resetSteps()
	}

	return (
		<>
			<Stepper
				orientation={orientation}
				labelOrientation={labelOrientation}
				activeStep={activeStep}
				enableAllSteps={enableAllSteps}
				onClickStep={onClickStep}
			>
				{steps.map((step, index) => (
					<Step index={index} key={index} isCompletedStep={isStepCompleted(index)} {...step}>
						<div className="min-h-[160px] flex justify-between flex-col w-full rounded-lg bg-indigo-100 p-4 text-gray-900">
							<p>This is Step {index + 1}</p>

							{!isStepperFinished && (
								<StepperControlsArea>
									<Button size="sm" onClick={handleNext}>
										{isLastStep ? 'Finish' : 'Next'}
									</Button>
									{isOptionalStep && (
										<Button size="sm" variant="secondary" onClick={nextStep}>
											Skip
										</Button>
									)}
									{activeStep !== 0 && (
										<Button size="sm" disabled={isDisabledStep} onClick={prevStep}>
											Prev
										</Button>
									)}
								</StepperControlsArea>
							)}
						</div>
					</Step>
				))}
			</Stepper>

			{isStepperFinished && (
				<div className="min-h-[160px] flex justify-between flex-col w-full rounded-lg bg-blue-200 p-4 text-gray-900">
					<h2>All steps completed!</h2>
					<div className="flex items-center justify-end gap-2 mt-2">
						<Button size="sm" onClick={handleReset}>
							Reset
						</Button>
					</div>
				</div>
			)}
		</>
	)
}

const meta: Meta = {
	title: 'Display/Stepper',
	render: ({ orientation, labelOrientation, enableAllSteps }) => (
		<StepperDemo
			orientation={orientation}
			labelOrientation={labelOrientation}
			enableAllSteps={enableAllSteps}
		/>
	),
	args: {
		orientation: 'horizontal',
		labelOrientation: 'horizontal',
		enableAllSteps: false,
	},
	argTypes: {
		orientation: {
			options: ['horizontal', 'vertical'],
			control: { type: 'radio' },
		},
		labelOrientation: {
			options: ['horizontal', 'vertical'],
			control: { type: 'radio' },
		},
		enableAllSteps: {
			control: { type: 'boolean' },
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)

		if (canvas.queryByRole('form', { name: 'Email subscription form' })) {
			return //interactions for the Default story only
		}

		const stepper = canvas.getByRole('tablist')
		expect(stepper).toBeInTheDocument()
		expect(stepper).toHaveAttribute('data-orientation', args.orientation)
		//step1
		const step1 = within(stepper).getByRole('tab', { name: /Step 1/i })
		expect(step1).toBeInTheDocument()
		expect(step1).toHaveAccessibleName()
		expect(step1).toBeEnabled()
		expect(step1).toHaveAttribute('data-highlighted', 'false') //!isCompletedStep
		const indi1 = within(step1).getByTestId('indicator')

		expect(indi1).toHaveClass('bg-black') //current
		expect(indi1).toHaveTextContent('1') //1

		const tabpanel1 = canvas.getByRole('tabpanel')
		expect(tabpanel1).toBeInTheDocument()
		expect(tabpanel1).toBeVisible()
		expect(tabpanel1).toHaveAttribute('data-state', 'active')
		expect(tabpanel1).toHaveTextContent(/This is Step 1/i)

		//step2
		const step2 = within(stepper).getByRole('tab', { name: /Step 2/i })
		expect(step2).toBeInTheDocument()
		expect(step2).toHaveAccessibleName()

		if (args.enableAllSteps) {
			//if all steps enabled
			expect(step2).toBeEnabled() //step2 enabled
			expect(step2).toHaveAttribute('data-highlighted', 'false') //!isCompletedStep
			//go to step2 without completing step1
			await userEvent.click(step2)
			const tabpanel2 = canvas.getByRole('tabpanel')
			expect(tabpanel2).toHaveTextContent(/This is Step 2/i)
		} else {
			//if other steps disabled
			expect(step2).toBeDisabled()

			//complete step1
			await userEvent.click(canvas.getByRole('button', { name: 'Next' }))
			//then step2 is enabled
			expect(step2).toBeEnabled()
			expect(step2).toHaveAttribute('data-highlighted', 'false') //!isCompletedStep
			const tabpanel2 = canvas.getByRole('tabpanel')
			expect(tabpanel2).toHaveTextContent(/This is Step 2/i)

			//step1 is completed, has checkmark
			expect(step1).toHaveAttribute('data-highlighted', 'true') //isCompletedStep
			expect(indi1).toHaveClass('bg-brand') //completed
			expect(indi1).not.toHaveTextContent('1')
			const checkmark = within(indi1).getByTestId('checkmark')
			expect(checkmark).toBeVisible()
		}
	},
}

export default meta

export const Default: StoryObj = {}

// ------------------------------------ Form example

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/forms/Form'
import { CheckboxField } from '@/forms/fields/CheckboxField'
import { TextInputField } from '@/forms/fields/TextInputField'
import { GlobalToastRegion, addToastToQueue } from '@/components/notifications/Toast'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'

const formSteps = [{ label: 'Name' }, { label: 'Email' }, { label: 'Terms' }] satisfies StepConfig[]

const FormSchema = z.object({
	name: z
		.string({
			required_error: 'Enter a valid name.',
		})
		.min(2, {
			message: 'Name should be more than two characters.',
		}),
	email: z.string().min(1, { message: 'Enter a valid email.' }).email('This is not a valid email.'),
	terms: z.boolean().refine((v) => v === true, {
		message: 'Required.',
	}),
})

const StepperWithFormDemo = ({
	orientation,
	labelOrientation,
}: {
	orientation: 'horizontal' | 'vertical'
	labelOrientation: 'horizontal' | 'vertical'
}) => {
	const {
		nextStep,
		prevStep,
		resetSteps,
		setStep,
		completeAndNextStep,
		activeStep,
		isDisabledStep,
		isLastStep,
		isStepperFinished,
		isOptionalStep,
		isStepCompleted,
	} = useStepper({
		initialStep: 0,
		steps: formSteps,
	})

	const onClickStep = (i: number) => {
		setStep(i)
	}

	const handleNext = () => {
		completeAndNextStep()
	}

	const handleReset = () => {
		resetSteps()
		form.reset()
	}

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		handleNext() //finish stepper

		addToastToQueue({
			title: 'You submitted the following values:',
			description: <JsonCodeBlockDisplay data={data} />,
		})
	}

	const form = useForm<z.infer<typeof FormSchema>>({
		mode: 'onBlur', // https://react-hook-form.com/docs/useform#mode
		reValidateMode: 'onSubmit',
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: '',
			email: '',
		},
	})

	return (
		<div className="max-w-lg mx-auto">
			<Form formMethods={form} formName="Email subscription form" onSubmit={onSubmit}>
				<Stepper
					orientation={orientation}
					labelOrientation={labelOrientation}
					activeStep={activeStep}
					onClickStep={onClickStep}
				>
					{formSteps.map((step, index) => (
						<Step index={index} key={index} isCompletedStep={isStepCompleted(index)} {...step}>
							<div className="rounded-lg border bg-white  shadow p-4 text-gray-900 mt-6">
								<div className="max-w-[280px] w-full mx-auto py-4">
									{index === 0 && (
										<TextInputField
											type="text"
											id="name"
											name="name"
											label="Name"
											placeholder="Your name"
											control={form.control}
										/>
									)}
									{index === 1 && (
										<TextInputField
											type="email"
											id="email"
											name="email"
											label="Email"
											placeholder="Your email address"
											control={form.control}
										/>
									)}
									{index === 2 && (
										<CheckboxField
											control={form.control}
											id="terms"
											name="terms"
											label="Terms & conditions"
										/>
									)}
								</div>

								{!isStepperFinished && (
									<StepperControlsArea>
										{!isLastStep && (
											<Button
												size="sm"
												disabled={
													(activeStep === 0 &&
														(!form.getValues().name || !!form.formState.errors.name)) ||
													(activeStep === 1 &&
														(!form.getValues().email || !!form.formState.errors.email)) ||
													(activeStep === 2 &&
														(!form.getValues().terms || !!form.formState.errors.terms))
												}
												onClick={handleNext}
											>
												Next
											</Button>
										)}
										{isLastStep && (
											<Button
												size="sm"
												disabled={
													!!form.formState.errors.name ||
													!!form.formState.errors.email ||
													!form.getValues().terms ||
													!!form.formState.errors.terms
												}
												type="submit"
											>
												Submit
											</Button>
										)}

										{isOptionalStep && (
											<Button size="sm" variant="secondary" onClick={nextStep}>
												Skip
											</Button>
										)}

										{activeStep !== 0 && (
											<Button size="sm" disabled={isDisabledStep} onClick={prevStep}>
												Prev
											</Button>
										)}
									</StepperControlsArea>
								)}
							</div>
						</Step>
					))}
				</Stepper>

				{isStepperFinished && (
					<div className="min-h-[160px] flex justify-between flex-col w-full rounded-lg bg-blue-200 p-4 text-gray-900">
						<h2>All steps completed!</h2>
						<div className="flex items-center justify-end gap-2 mt-2">
							<Button size="sm" onClick={handleReset}>
								Reset
							</Button>
						</div>
					</div>
				)}
			</Form>

			<GlobalToastRegion />
		</div>
	)
}

export const StepperWithForm: StoryObj = {
	// @ts-expect-error implicit any type
	render: ({ orientation, labelOrientation }) => (
		<StepperWithFormDemo orientation={orientation} labelOrientation={labelOrientation} />
	),
}
