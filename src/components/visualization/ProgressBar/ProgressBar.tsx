'use client'
import React, { useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import {
	ProgressBar as ProgressBarComponent,
	Label,
	ProgressBarProps as ProgressBarComponentProps,
} from 'react-aria-components'

// https://react-spectrum.adobe.com/react-aria/ProgressBar.html

// ------------------------------------- ProgressBar

export type ProgressBarProps = ProgressBarComponentProps & {
	label: string
	srOnlyLabel?: boolean
	indeterminate?: boolean
}
const ProgressBar = ({
	className,
	value,
	indeterminate,
	label,
	srOnlyLabel,
	...props
}: ProgressBarProps) => {
	const [styleWidth, setStyleWidth] = useState('0px')

	useEffect(() => {
		if (!indeterminate && value) {
			if (value < 0) {
				setStyleWidth('0%')
			} else if (value > 0 && value < 100) {
				setStyleWidth(`${value}%`)
			} else if (value >= 100) {
				setStyleWidth('100%')
			}
		} else {
			setStyleWidth('')
		}
	}, [value, indeterminate])

	const getDisplayValue = () => {
		//do not show -0 or 100+ (in case of bug/mistake)
		if (value) {
			if (value >= 100) {
				return 100
			}
			if (value <= 0) {
				return 0
			}
		}
		return value
	}

	return (
		<ProgressBarComponent
			value={value ? value : 0}
			isIndeterminate={indeterminate}
			data-state={indeterminate ? 'indeterminate' : value === 100 ? 'completed' : value}
			className={className}
			{...props}
		>
			<>
				<Label className={cn('labelStyles', srOnlyLabel && 'sr-only')}>{label}</Label>
				<div className="relative h-5 w-full">
					{/* div with just the border, absolute so that the border does not contain the bar,
		 the indigo bar sits exactly on top of the border */}
					<div
						className={cn(
							'absolute inset-0 rounded-full border border-indigo-600 bg-white',
							value && 'z-[1]'
						)}
					/>
					{/* div with overflow hidden contains the bar */}
					<div className="absolute inset-0 rounded-full overflow-hidden">
						{/* div with bg-black to trick the next div to turn the text white (blend mode) */}
						<div
							style={{
								width: !indeterminate && value ? styleWidth : '',
							}}
							className={cn(
								'absolute inset-0 rounded-full transition-all duration-300 ease-out',
								value && 'bg-black z-[2]'
							)}
						/>
						{/* div with bg-brand fill with z-4 so it sits over the bg-black
		  but has mix-blend-screen so the percentage text (next div) is visible */}
						<div
							style={{
								width: !indeterminate && value ? styleWidth : '',
							}}
							className={cn(
								'absolute inset-0 rounded-full bg-indigo-600 transition-all duration-300 ease-out',
								indeterminate ? 'animate-indeterminate-bar duration-3000' : 'z-[4] mix-blend-screen'
							)}
						/>
					</div>
					{/* div with percentage text turns black/white based on its background with mix-blend-difference */}
					{value && (
						<div className="absolute left-[46%] text-white text-sm font-medium mix-blend-difference z-[3]">
							{getDisplayValue()}%
						</div>
					)}
				</div>
			</>
		</ProgressBarComponent>
	)
}

// ------------------------------------- ProgressBar Exports

export { ProgressBar }
