'use client'
import React from 'react'
import { cn } from '@/utils/cn'
import { twColors } from '@/utils/colors'
import { addToastToQueue } from '@/components/notifications/Toast'

const ColorSwatch = ({ value, className }: { value: string; className?: string }) => {
	const colorName = value.includes('-') ? value.split('-')[0] : value
	const shade = value.includes('-') ? value.split('-')[1] : null

	// @ts-expect-error ignore this for now (string can't be used to index colors object type)
	const bgColor = shade ? twColors[colorName]?.[shade] : twColors[colorName]

	function getTextColor() {
		if (['black', 'brand', 'success', 'error', 'warning'].includes(colorName)) return 'text-white'
		if (colorName === 'white') return 'text-black'
		if (shade) {
			return Number(shade) >= 500 ? 'text-white' : 'text-black'
		}
		return 'text-black'
	}

	return (
		<div
			style={{ backgroundColor: bgColor }} //use style => no need to safelist all colors in TW
			className={cn(
				'p-1 md:p-4 grid grid-cols-2 items-center text-sm md:text-base',
				getTextColor(),
				className
			)}
		>
			<CopyBtn type="class" colorName={colorName} className="text-left font-medium">
				{value}
			</CopyBtn>
			<CopyBtn type="hex" colorName={colorName} className="text-right">
				{bgColor}
			</CopyBtn>
		</div>
	)
}

type CopyBtnProps = {
	colorName: string
	children: string
	className?: string
	type: 'class' | 'hex'
}

const CopyBtn = ({ colorName, children, className, type = 'class' }: CopyBtnProps) => {
	const handleCopy: React.MouseEventHandler<HTMLButtonElement> = (e) => {
		e.preventDefault()
		navigator.clipboard.writeText(children)
		addToastToQueue({
			description: (
				<>
					Copied<code className="text-brand mx-1">`{children}`</code> to clipboard
				</>
			),
		})
	}

	const ariaLabel =
		type === 'hex' ? `Copy hex value for ${colorName}` : `Copy tailwind class name for ${colorName}`

	return (
		<button onClick={handleCopy} className={cn(className)} aria-label={ariaLabel}>
			{children}
		</button>
	)
}

const ColorSwatchGroup = ({ colors }: { colors: string[] }) => {
	return (
		<div className="flex flex-col gap-0 rounded-md">
			{colors &&
				colors?.map((c, i) => {
					return (
						<ColorSwatch
							key={c}
							value={c}
							className={cn(i === 0 && 'rounded-t-md', i === colors?.length - 1 && 'rounded-b-md')}
						/>
					)
				})}
		</div>
	)
}

type ColorObject = {
	[key: string]: string | { [shade: string]: string }
}
// function to turn themeColors to array of arrays of color names for display
// returns color groups in order: white/black, accent, grays, other groups in tw config order
function groupColorsIntoLists(colors: ColorObject): string[][] {
	const baseColorsList: string[] = []
	const statusColorsList: string[] = []
	const colorLists: string[][] = Object.entries(colors)
		.filter(([key]) => key !== 'inherit' && key !== 'transparent' && key !== 'current')
		.map(([key, value]) => {
			if (typeof value === 'string') {
				if (key === 'white' || key === 'black') {
					baseColorsList.push(key)
				} else {
					statusColorsList.push(key)
				}
				return []
			} else {
				const shades = Object.keys(value)
				return shades.map((shade) => `${key}-${shade}`)
			}
		})
	// remove any empty arrays
	const filteredColorLists = colorLists.filter((arr) => arr.length > 0)
	// add base & status colors to beginning of array
	filteredColorLists.unshift(statusColorsList)
	filteredColorLists.unshift(baseColorsList)
	return filteredColorLists
}

export { ColorSwatch, ColorSwatchGroup, groupColorsIntoLists }
