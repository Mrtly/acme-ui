import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/display/Accordion'

import { userEvent, waitFor, within, expect } from '@storybook/test'

const meta: Meta<typeof Accordion> = {
	title: 'Display/Accordion',
	render: () => (
		<Accordion type="single" collapsible className="w-full">
			<AccordionItem value="item-1">
				<AccordionTrigger>Is it accessible?</AccordionTrigger>
				<AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Is it styled?</AccordionTrigger>
				<AccordionContent>
					Yes. It comes with default styles that matches the other components&apos; aesthetic.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Is it animated?</AccordionTrigger>
				<AccordionContent>
					Yes. It&apos;s animated by default, but you can disable it if you prefer.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const accordionTrigger = 'Is it accessible?'
		const accordionContent = 'Yes. It adheres to the WAI-ARIA design pattern.'
		const button = canvas.getByRole('button', { name: accordionTrigger })

		expect(canvas.queryByText(accordionContent)).not.toBeInTheDocument()
		await expect(button).toBeInTheDocument()
		await userEvent.click(button)
		await expect(canvas.getByText(accordionContent)).toBeVisible()
		await userEvent.click(button)
		await waitFor(() => {
			expect(canvas.queryByText(accordionContent)).not.toBeInTheDocument()
		})
		button.blur()
	},
}

export default meta

type Story = StoryObj<typeof Accordion>

export const Default: Story = {}
