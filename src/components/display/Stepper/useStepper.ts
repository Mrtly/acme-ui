import React from 'react'

import { StepProps } from './Stepper'

export type useStepperParams = {
	initialStep: number
	steps: Pick<StepProps, 'label' | 'description' | 'optional' | 'optionalLabel' | 'icon'>[]
}

export type useStepperReturn = {
	nextStep: () => void
	prevStep: () => void
	resetSteps: () => void

	setStep: (step: number) => void
	completeAndNextStep: () => void
	activeStep: number
	isDisabledStep: boolean
	isLastStep: boolean
	isStepperFinished: boolean
	isOptionalStep: boolean | undefined

	isStepCompleted: (step: number) => boolean
}

const useStepper = ({ initialStep, steps }: useStepperParams): useStepperReturn => {
	const [activeStep, setActiveStep] = React.useState(initialStep)
	const [completedSteps, setCompletedSteps] = React.useState<number[]>([])

	const nextStep = () => {
		setActiveStep((prev) => prev + 1)
	}

	const prevStep = () => {
		setActiveStep((prev) => prev - 1)
	}

	const completeAndNextStep = () => {
		setCompletedSteps((completedSteps) => [...completedSteps, activeStep])
		nextStep()
	}

	const resetSteps = () => {
		setActiveStep(initialStep)
		setCompletedSteps([])
	}

	const setStep = (step: number) => {
		setActiveStep(step)
	}

	const isDisabledStep = activeStep === 0

	const isLastStep = activeStep === steps.length - 1

	const isStepperFinished = activeStep === steps.length

	const isOptionalStep = steps[activeStep]?.optional

	const isStepCompleted = (step: number): boolean => {
		return completedSteps.includes(step)
	}

	return {
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
	}
}

// ------------------------------------- useStepper export

export { useStepper }
