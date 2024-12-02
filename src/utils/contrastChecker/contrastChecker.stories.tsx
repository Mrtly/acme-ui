import React, { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	Combobox,
	ComboboxContent,
	ComboboxItem,
	ComboboxTrigger,
} from '@/components/forms/inputs/Combobox'
import { Icon } from '@/theme/Icons'
import JsonCodeBlockDisplay from '@/utils/helpers/JsonCodeBlockDisplay'
import { checkContrast, type ContrastResult } from './contrastChecker'
import { cn } from '@/utils/cn'
import { twColors } from '../colors'

// ------------------------------------- Color Helper Functions

type ColorObject = {
	[key: string]: string | { [shade: string]: string }
}

//turns all colors into a single array of strings
function flattenColors(colorObject: ColorObject, prefix = ''): string[] {
	const colorNames: string[] = []
	for (const key in colorObject) {
		const value = colorObject[key]
		const fullKey = prefix ? `${prefix}-${key}` : key
		if (typeof value === 'string') {
			colorNames.push(fullKey)
		} else if (typeof value === 'object') {
			colorNames.push(...flattenColors(value, fullKey))
		}
	}
	return colorNames
		.map((c) => c.replace(/-DEFAULT$/, ''))
		.filter((c) => !c.includes('inherit') && !c.includes('transparent') && !c.includes('current'))
}

//this finds the hex to by used by style backgroundColor (so we don't have to safelist every color in TW)
function findColorHex(color: string) {
	if (['gray', 'green', 'red', 'orange', 'teal', 'blue', 'purple'].includes(color)) {
		//@ts-expect-error ignore for now because colors will change
		return twColors[color]['DEFAULT']
	}
	//@ts-expect-error ignore for now because colors will change
	if (!color.includes('-')) return twColors[color]
	const [colorName, colorShade] = color.split('-')
	//@ts-expect-error ignore for now because colors will change
	const colorHex = twColors[colorName][colorShade]
	return colorHex
}

// ------------------------------------- ColorSquarie

const ColorSquarie = ({ color, className }: { color: string; className?: string }) => {
	return (
		<div
			style={{ backgroundColor: findColorHex(color) }}
			//TW linter does not recognize the dynamic class
			//eslint-disable-next-line tailwindcss/no-custom-classname
			className={cn(
				`size-10 rounded-md bg-${color}`,
				color === 'white' && 'border border-dashed border-gray-700',
				className
			)}
		/>
	)
}

// ------------------------------------- ColorCombobox

// @ts-expect-error messy color types wip
const colorNamesArray = flattenColors(twColors)

const ColorCombobox = ({
	label,
	defaultInputValue,
	inputValue,
	onSelectionChange,
}: {
	label: string
	defaultInputValue?: string
	inputValue?: string
	onSelectionChange: () => void
}) => {
	return (
		<Combobox
			label={label}
			defaultInputValue={defaultInputValue}
			inputValue={inputValue}
			defaultSelectedKey={defaultInputValue}
			selectedKey={inputValue}
			onInputChange={onSelectionChange}
			onSelectionChange={() => onSelectionChange}
			className="w-48"
		>
			<ComboboxTrigger id={label} placeholder={label} />
			<ComboboxContent maxHeight={400}>
				{colorNamesArray.map((c) => {
					return (
						<ComboboxItem key={c} value={c} textValue={c}>
							<ColorSquarie
								color={c}
								className={cn(
									'size-8',
									c === 'black' && inputValue === 'black' && 'border border-dashed border-white'
								)}
							/>
							{c}
						</ComboboxItem>
					)
				})}
			</ComboboxContent>
		</Combobox>
	)
}

// ------------------------------------- RatioSquarie

const RatioSquarie = ({ data }: { data: ContrastResult | undefined }) => {
	return (
		<div
			className={cn(
				'border-2 rounded-md w-fit p-2 text-center font-semibold mx-auto',
				data?.AA === 'pass' && 'border-success',
				data?.AA === 'fail' && 'border-error'
			)}
		>
			<div className="">Contrast ratio</div>
			<span className="font-medium text-3xl">{data?.ratio} </span>
		</div>
	)
}

// ------------------------------------- ConstrastCheckerTool

const ConstrastCheckerTool = () => {
	const [foregroundColor, setForegroundColor] = useState('black')
	const [backgroundColor, setBackgroundColor] = useState('white')
	const [data, setData]: [
		undefined | ContrastResult,
		React.Dispatch<React.SetStateAction<undefined | ContrastResult>>,
	] = useState()

	const colorsExist =
		colorNamesArray.includes(foregroundColor) && colorNamesArray.includes(backgroundColor)

	useEffect(() => {
		if (!colorsExist) return //do not run if colors do not exist
		checkContrast(findColorHex(foregroundColor), findColorHex(backgroundColor)).then((res) =>
			setData(res)
		)
	}, [foregroundColor, backgroundColor, colorsExist])

	const SwapButton = () => {
		const swapAction = () => {
			const temp = foregroundColor
			setForegroundColor(backgroundColor)
			setBackgroundColor(temp)
		}
		return (
			<button
				onClick={swapAction}
				title="Swap foreground and background colors"
				aria-label="Swap foreground and background colors"
				className="rounded-full shrink-0 px-3 border mt-4 hover:bg-gray-200 transition-colors duration-200"
			>
				<Icon name="Repeat" size="sm" />
			</button>
		)
	}

	return (
		<div className="w-fit flex flex-col gap-4">
			<div className="flex gap-4">
				<div
					style={{ alignItems: 'flex-end' }} //tw class not working? fix
					className="flex items-end gap-1"
				>
					<ColorCombobox
						label="Foreground color"
						defaultInputValue={foregroundColor}
						inputValue={foregroundColor}
						onSelectionChange={() => setForegroundColor}
					/>
					<ColorSquarie color={foregroundColor} />
				</div>
				<SwapButton />
				<div
					style={{ alignItems: 'flex-end' }} //tw class not working? fix
					className="flex items-end gap-1"
				>
					<ColorCombobox
						label="Background color"
						defaultInputValue={backgroundColor}
						inputValue={backgroundColor}
						onSelectionChange={() => setBackgroundColor}
					/>
					<ColorSquarie color={backgroundColor} />
				</div>
			</div>
			{data && <RatioSquarie data={data} />}
			{data && (
				<div className="mx-auto w-fit">
					<JsonCodeBlockDisplay data={data} />
				</div>
			)}
		</div>
	)
}
const meta: Meta = {
	title: 'Utils/contrastChecker',
	render: () => <ConstrastCheckerTool />,
}

export default meta

export const Default: StoryObj = {}
