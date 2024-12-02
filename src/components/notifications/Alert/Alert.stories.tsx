import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import { useEffect, useState } from 'react'
import {
	Alert,
	AlertContent,
	AlertActions,
	AlertArea,
	AlertVariants,
	AlertActionLink,
} from './Alert'
import { useAlertService } from './alertService'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/forms/inputs/Select'
import { Button } from '@/components/buttons/Button'

const meta: Meta<typeof Alert> = {
	title: 'Notifications/Alert',
	render: ({ variant }) => (
		<Alert variant={variant}>
			<AlertContent>
				An alert message should be written in complete sentences using punctuation. The alert should
				identify a problem in detail and provide a solution (when possible).
			</AlertContent>
			<AlertActions onDismiss={() => console.log('dismiss')}>
				{/* <AlertActionButton onClick={() => console.log('action button clicked')}>
					Take action
				</AlertActionButton> */}
				<AlertActionLink
					href="/"
					onClick={(e) => {
						e.preventDefault()
						console.log('link clicked')
					}}
				>
					Go to Settings
				</AlertActionLink>
			</AlertActions>
		</Alert>
	),
}

export default meta

type Story = StoryObj<typeof Alert>

export const Default: Story = {
	args: {
		variant: 'info',
	},
	argTypes: {
		variant: {
			options: ['neutral', 'info', 'success', 'warning', 'error'],
			control: { type: 'radio' },
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement)
		const alert = canvas.getByRole('alert')
		if (args.variant === 'neutral') {
			expect(alert.className).toContain('border-gray-700 bg-gray-700')
		} else if (args.variant === 'info') {
			expect(alert.className).toContain('border-blue-800 bg-blue-800')
		} else {
			expect(alert.className).toContain(`border-${args.variant} bg-${args.variant}`)
		}
		const icon = within(alert).getByTestId(`icon-${args.variant}`)
		expect(icon).toBeVisible()
		expect(icon.className).toContain('text-white')
		expect(canvas.getByText(/An alert message should be written/i)).toBeVisible()

		const alertActionLink = within(alert).getByRole('link', {
			name: 'Go to Settings',
		})
		expect(alertActionLink).toBeInTheDocument()
		expect(alertActionLink).toBeVisible()
		expect(alertActionLink).toHaveAccessibleName()

		const dismissButton = within(alert).getByRole('button', {
			name: 'Dismiss',
		})
		expect(dismissButton).toBeInTheDocument()
		expect(dismissButton).toBeVisible()
		expect(dismissButton).toHaveAccessibleName()
	},
}

const AlertsHookDemo = () => {
	const { addAlert, clearAlerts } = useAlertService()

	const [variant, setVariant] = useState<AlertVariants>('info')

	const add = () => {
		addAlert({
			content: `New alert created with variant ${variant}`,
			variant: variant,
			isDismissible: true,
			onDismissAction: () => {
				console.log('clicked dismiss')
			},
			action: {
				label: 'Action',
				onClick: () => console.log('action'),
			},
			// link: {
			// 	label: 'Link',
			// 	href: 'https://www.example.com',
			// },
		})
	}

	useEffect(() => {
		add()
	}, [])

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-end w-full gap-2">
				<Select
					label="Variant"
					name="variant"
					defaultSelectedKey={variant}
					onSelectionChange={(k) => setVariant(k as AlertVariants)}
					className="w-28"
				>
					<SelectTrigger id="select-variant" small />
					<SelectContent>
						<SelectItem id="neutral" value="neutral">
							neutral
						</SelectItem>
						<SelectItem id="info" value="info">
							info
						</SelectItem>
						<SelectItem id="success" value="success">
							success
						</SelectItem>
						<SelectItem id="warning" value="warning">
							warning
						</SelectItem>
						<SelectItem id="error" value="error">
							error
						</SelectItem>
					</SelectContent>
				</Select>

				<Button size="sm" className="w-fit" onClick={() => add()}>
					Alert
				</Button>
				<Button variant="ghost" size="sm" onClick={() => clearAlerts()}>
					Clear all
				</Button>
			</div>
			<AlertArea />
		</div>
	)
}

export const AlertAreaAndHook: Story = {
	render: () => <AlertsHookDemo />,
}
