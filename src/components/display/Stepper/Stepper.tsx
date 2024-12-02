'use client'
import React from 'react'
import { cn } from '@/utils/cn'
import { VariantProps, cva } from 'class-variance-authority'
import { Separator } from '../../../utility/Separator'
import { Icon } from '@/theme/Icons'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import * as TabsPrimitive from '@radix-ui/react-tabs'

// Stepper Inspiration: open PR in shadcn-ui https://github.com/shadcn-ui/ui/pull/318/,
// https://chakra-ui.com/docs/components/stepper/,
// https://material.angular.io/components/stepper/overview

// Tab Primitives:  https://www.radix-ui.com/primitives/docs/components/tabs,
// https://ui.shadcn.com/docs/components/tabs

// ------------------------------------- Context

export type StepperContextValue = StepperProps & {
	isClickable?: boolean
	isVertical?: boolean
	isLabelVertical?: boolean
	stepCount?: number
}

const StepperContext = React.createContext<StepperContextValue>({
	activeStep: 0,
})

const useStepperContext = () => React.useContext(StepperContext)

const StepperProvider: React.FC<{
	value: StepperContextValue
	children: React.ReactNode
}> = ({ value, children }) => {
	const isVertical = value.orientation === 'vertical'
	const isLabelVertical = value.orientation !== 'vertical' && value.labelOrientation === 'vertical'

	return (
		<StepperContext.Provider
			value={{
				...value,
				isVertical,
				isLabelVertical,
			}}
		>
			{children}
		</StepperContext.Provider>
	)
}

// ------------------------------------- Stepper

export type StepperProps = React.HTMLAttributes<HTMLDivElement> & {
	activeStep: number
	orientation?: 'vertical' | 'horizontal'
	responsive?: boolean

	onClickStep?: (step: number) => void
	labelOrientation?: 'vertical' | 'horizontal'
	children?: React.ReactNode
	enableAllSteps?: boolean
}

const Stepper = ({
	activeStep = 0,
	responsive = true,
	orientation: orientationProp = 'horizontal',
	onClickStep,
	labelOrientation = 'horizontal',
	children,
	enableAllSteps,
	className,
	...props
}: StepperProps) => {
	const childArr = React.Children.toArray(children)

	const stepCount = childArr.length

	const renderHorizontalContent = () => {
		if (activeStep <= childArr.length) {
			return React.Children.map(childArr[activeStep], (node) => {
				if (!React.isValidElement(node)) return
				return React.Children.map(node.props.children, (childNode) => (
					<TabsPrimitive.Content value={`step${node.props.index}`} tabIndex={-1} aria-live="polite">
						{childNode}
					</TabsPrimitive.Content>
				))
			})
		}
	}

	const isClickable = !!onClickStep

	const isMobile = useMediaQuery('(max-width: 43em)')

	const orientation = isMobile && responsive ? 'vertical' : orientationProp

	return (
		<StepperProvider
			value={{
				activeStep,
				orientation,
				responsive,
				onClickStep,
				labelOrientation,
				isClickable,
				stepCount,
			}}
		>
			<TabsPrimitive.Root
				defaultValue="step0"
				value={`step${activeStep}`}
				orientation={orientation}
			>
				<TabsPrimitive.List
					{...props}
					className={cn(
						'flex w-full flex-1 justify-between gap-4 text-center mb-1',
						orientation === 'vertical' ? 'flex-col' : 'flex-row',
						className
					)}
					data-orientation={orientation}
				>
					{React.Children.map(children, (child, i) => {
						const isCompletedStep =
							(React.isValidElement(child) && child.props.isCompletedStep) ?? i < activeStep
						const isLastStep = i === stepCount - 1
						const isCurrentStep = i === activeStep

						const isEnabledStep = enableAllSteps

						const stepProps = {
							index: i,
							isCompletedStep,
							isCurrentStep,
							isLastStep,
							isEnabledStep,
						}

						if (React.isValidElement(child)) {
							return React.cloneElement(child, stepProps)
						}

						return null
					})}
				</TabsPrimitive.List>
				{orientation === 'horizontal' && renderHorizontalContent()}
			</TabsPrimitive.Root>
		</StepperProvider>
	)
}

// ------------------------------------- Step

const stepVariants = cva('relative flex flex-row gap-2', {
	variants: {
		isLastStep: {
			true: 'flex-[0_0_auto] justify-end',
			false: 'flex-[1_0_auto] justify-start',
		},
		isVertical: {
			true: 'flex-col',
			false: 'items-center',
		},
	},
	compoundVariants: [
		{
			isVertical: true,
			isLastStep: true,
			class: 'w-full flex-[1_0_auto] flex-col items-start justify-start',
		},
	],
})

export type StepConfig = StepLabelProps & {
	icon?: React.ReactElement
}

export type StepProps = React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof stepVariants> &
	StepConfig

export type StepStatus = {
	index: number
	isCompletedStep?: boolean
	isCurrentStep?: boolean
	isEnabledStep?: boolean
}

export type StepAndStatusProps = StepProps & StepStatus

const Step = React.forwardRef<HTMLButtonElement, StepAndStatusProps>((props, ref) => {
	const {
		children,
		description,
		icon: CustomIcon,
		index,
		isCompletedStep,
		isCurrentStep,
		isLastStep,
		isEnabledStep,
		label,
		optional,
		optionalLabel,
		className,
		...rest
	} = props

	const { isVertical, isLabelVertical, onClickStep, isClickable } = useStepperContext()

	const hasVisited = isCurrentStep || isCompletedStep

	const handleClick = (index: number) => {
		if (isClickable && onClickStep) {
			onClickStep(index)
		}
	}

	const StepIcon = React.useMemo(() => CustomIcon ?? null, [CustomIcon])

	const RenderIcon = React.useMemo(() => {
		if (isCompletedStep) return <Icon name="Check" size="md" data-testid="checkmark" />
		if (StepIcon) return StepIcon
		return (index || 0) + 1
	}, [isCompletedStep, StepIcon, index])

	return (
		<div
			className={cn(
				stepVariants({
					isLastStep,
					isVertical,
				}),
				className
			)}
			{...rest}
		>
			<TabsPrimitive.Trigger
				ref={ref}
				value={`step${index.toString()}`}
				className={cn(
					'flex items-center gap-2 p-2 rounded-lg text-gray-500 bg-white w-fit disabled:cursor-not-allowed',
					isLabelVertical && 'flex-col',
					isCurrentStep && 'border border-brand',
					(isEnabledStep || (hasVisited && !isCurrentStep)) &&
						'cursor-pointer hover:bg-gray-100 focus-visible:bg-gray-100'
				)}
				disabled={isEnabledStep ? false : !hasVisited}
				onClick={() => handleClick(index)}
				aria-selected={isCurrentStep}
				aria-current={isCurrentStep ? 'step' : undefined}
				data-highlighted={isCompletedStep}
				data-clickable={isClickable}
			>
				<div
					className={cn(
						'aspect-square flex flex-col items-center justify-center text-white',
						'size-8 rounded-full data-[highlighted=true]:bg-brand data-[highlighted=true]:text-white',
						(isCompletedStep || typeof RenderIcon !== 'number') && 'p-2',
						isEnabledStep || isCurrentStep ? 'bg-black' : 'bg-gray-500',
						isCompletedStep && 'bg-brand'
					)}
					aria-hidden="true"
					data-testid="indicator"
				>
					{RenderIcon}
				</div>
				<StepLabel
					label={label}
					description={description}
					optional={optional}
					optionalLabel={optionalLabel}
					{...{ isCurrentStep }}
				/>
			</TabsPrimitive.Trigger>
			<Connector
				index={index}
				isLastStep={isLastStep}
				hasLabel={!!label || !!description}
				isCompletedStep={isCompletedStep || false}
			>
				{(isCurrentStep || isCompletedStep) && children}
			</Connector>
		</div>
	)
})

Step.displayName = 'Step'

// ------------------------------------- StepLabel

export type StepLabelProps = {
	label: string | React.ReactNode
	description?: string | React.ReactNode
	optional?: boolean
	optionalLabel?: string | React.ReactNode
}

const StepLabel = ({ label, description, optional, optionalLabel }: StepLabelProps) => {
	const { isLabelVertical, orientation } = useStepperContext()

	const shouldRender = !!label || !!description

	const renderOptionalLabel = !!optional && !!optionalLabel

	return shouldRender ? (
		<div
			className={cn(
				'flex w-max flex-col justify-center',
				isLabelVertical ? 'items-center text-center' : 'items-start text-left'
			)}
		>
			{!!label && (
				<div>
					{label}
					{renderOptionalLabel && (
						<span className="ml-1 text-sm text-gray-500">({optionalLabel})</span>
					)}
				</div>
			)}
			{!!description && (
				<div className={cn('text-sm', orientation === 'horizontal' && 'max-w-[200px]')}>
					{description}
				</div>
			)}
		</div>
	) : null
}

StepLabel.displayName = 'StepLabel'

// ------------------------------------- Connector

export type ConnectorProps = React.HTMLAttributes<HTMLDivElement> & {
	index: number
	isCompletedStep: boolean
	isLastStep?: boolean | null
	hasLabel?: boolean
}

const Connector = React.memo(({ isCompletedStep, children, isLastStep, index }: ConnectorProps) => {
	const { isVertical } = useStepperContext()

	if (isVertical) {
		return (
			<div
				data-highlighted={isCompletedStep}
				className={cn(
					'ms-4 mt-1 flex h-auto min-h-8 flex-1 self-stretch border-l-2 ps-8',
					isLastStep && 'min-h-0 border-transparent',
					isCompletedStep && 'border-brand'
				)}
			>
				<TabsPrimitive.Content
					value={`step${index}`}
					tabIndex={-1}
					aria-live="polite"
					className="my-4 block h-auto w-full"
				>
					{children}
				</TabsPrimitive.Content>
			</div>
		)
	}

	if (isLastStep) {
		return null
	}

	return (
		<Separator
			data-highlighted={isCompletedStep}
			className="flex h-[2px] min-h-[auto] flex-1 self-auto data-[highlighted=true]:bg-brand"
			orientation={isVertical ? 'vertical' : 'horizontal'}
		/>
	)
})

Connector.displayName = 'Connector'
// ------------------------------------- Stepper Buttons Area

export type ButtonsAreaProps = { children: React.ReactNode; className?: string }

const StepperControlsArea = ({ children, className }: ButtonsAreaProps) => {
	const areaStyles = cn('flex flex-row-reverse items-center gap-2 mt-2', className)
	return <div className={areaStyles}>{children}</div>
}

// ------------------------------------- Stepper exports

export { useStepperContext, StepperProvider, Stepper, Step, StepperControlsArea }
