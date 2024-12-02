import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/buttons/Button'
import { GlobalToastRegion, addToastToQueue, LocalToastRegion } from './Toast'
import { type ToastStateType } from './Toast'

const meta: Meta = {
	title: 'Notifications/Toast',
	render: ({ variant }) => (
		<>
			<h2 className="mb-4">A single Toast in the Global Toast Queue</h2>
			<Button
				onClick={() =>
					addToastToQueue({
						title: 'Status update:',
						description: 'Your message has been sent.',
						variant: variant,
					})
				}
			>
				Show toast
			</Button>
			<GlobalToastRegion />
		</>
	),
	args: {
		variant: 'default',
	},
	argTypes: {
		variant: {
			options: ['default', 'info', 'success', 'warning', 'error'],
			control: {
				type: 'select',
			},
		},
	},
}

export default meta

type Story = StoryObj<typeof LocalToastRegion>

export const Default: Story = {}

export const WithAction: Meta = {
	title: 'UI/Toast',
	render: ({ variant }) => (
		<>
			<h2 className="mb-4">A Toast with an Action in the Global Toast Queue</h2>
			<div className="flex flex-col gap-2 max-w-max">
				<Button
					onClick={() =>
						addToastToQueue({
							title: 'You can take this action:',
							onAction: () => {
								alert('You took the action')
							},
							actionLabel: 'Action',
							shouldCloseOnAction: true,
							variant: variant,
						})
					}
				>
					Show a toast with action
				</Button>
			</div>
			<GlobalToastRegion />
		</>
	),
}

export const MultipleToasts: Meta = {
	title: 'UI/Toast',
	render: ({ variant }) => (
		<>
			<h2 className="mb-4">Multiple Toasts in the Global Toast Queue</h2>
			<div className="flex flex-col gap-2 max-w-max">
				<Button
					onClick={() =>
						addToastToQueue({ description: 'Toasting…', variant: variant }, { priority: 1 })
					}
				>
					Show low priority toast
				</Button>
				<Button
					onClick={() =>
						addToastToQueue({ description: 'Toast is done!', variant: variant }, { priority: 2 })
					}
				>
					Show medium priority toast
				</Button>
				<Button
					onClick={() =>
						addToastToQueue({ description: 'Toast is burned!', variant: variant }, { priority: 3 })
					}
				>
					Show high priority toast
				</Button>
			</div>
			<GlobalToastRegion />
		</>
	),
}

export const WithLocalRegion: Meta = {
	title: 'UI/Toast',
	render: ({ variant }) => (
		<LocalToastRegion>
			{(state: ToastStateType) => (
				<>
					<h2 className="mb-4">A Toast with its own LocalToastRegion</h2>
					<Button
						onClick={() =>
							state.add({
								title: 'This is a Toast with its own Provider',
								description: 'It is not in the GlobalToastRegion queue',
								variant: variant,
							})
						}
					>
						Show toast
					</Button>
				</>
			)}
		</LocalToastRegion>
	),
}
