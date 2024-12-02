import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { LoadingIndicator } from '@/components/visualization/LoadingIndicator'
import { expect, within } from '@storybook/test'

const meta: Meta<typeof LoadingIndicator> = {
	title: 'Visualization/LoadingIndicator',
	render: () => <LoadingIndicator />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const loadingIndicator = canvas.getByTestId('spinning-loader')
		await expect(loadingIndicator).toHaveClass('animate-spin-slow motion-reduce:animate-none')
		await expect(loadingIndicator).toBeInTheDocument()
		await expect(loadingIndicator).toBeVisible()
		await expect(loadingIndicator).toHaveAccessibleName()
		await expect(loadingIndicator).toHaveAttribute('role', 'img')
		await expect(loadingIndicator).toHaveAttribute('title', 'loading')
		await expect(loadingIndicator).toHaveAttribute('aria-label', 'Loading indicator')
	},
}

export const Dots: Meta<typeof LoadingIndicator> = {
	title: 'Visualization/LoadingIndicator',
	render: ({ ...args }) => <LoadingIndicator variant="dots" dotColor={args.dotColor} />,
	args: {
		dotColor: 'brand',
	},
	argTypes: {
		dotColor: {
			options: ['brand', 'black', 'gray'],
			control: {
				type: 'radio',
			},
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const loadingIndicator = canvas.getByTestId('dots-loader')
		const dot = canvas.getByTestId('dot')
		await expect(dot).toHaveClass('animate-pulse motion-reduce:animate-none')
		args.dotColor === 'brand'
			? await expect(dot).toHaveClass('bg-brand')
			: args.dotColor === 'black'
				? await expect(dot).toHaveClass('bg-black')
				: args.dotColor === 'gray'
					? await expect(dot).toHaveClass('bg-gray-500')
					: null

		await expect(loadingIndicator).toBeInTheDocument()
		await expect(loadingIndicator).toBeVisible()
		await expect(loadingIndicator).toHaveAccessibleName()
		await expect(loadingIndicator).toHaveAttribute('role', 'img')
		await expect(loadingIndicator).toHaveAttribute('title', 'loading')
		await expect(loadingIndicator).toHaveAttribute('aria-label', 'Loading indicator')
	},
}

export default meta

export const Default: StoryObj = {}
