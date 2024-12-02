import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
	Timeline,
	TimelineHeading,
	TimelineIndicator,
	TimelineItem,
	TimelineContent,
	TimelineSubheading,
} from './Timeline'
import { Badge } from '@/components/display/Badge'
import { Icon } from '@/theme/Icons'
import { DateFormat } from '../DateFormat'
import { within, expect } from '@storybook/test'

const meta: Meta = {
	title: 'Visualization/Timeline',
	render: () => (
		<Timeline>
			<TimelineItem>
				<TimelineIndicator variant="info" />
				<TimelineHeading>
					UI Lab v1.0.0 <Badge>Latest</Badge>
				</TimelineHeading>
				<TimelineSubheading>
					Released on <DateFormat date={new Date(2024, 2, 1)} />
				</TimelineSubheading>
				<TimelineContent>
					{`There's an artist hidden in the bottom of every single one of us.
						It's all a game of angles. Mountains are so simple, they're hard.`}
				</TimelineContent>
			</TimelineItem>

			<TimelineItem>
				<TimelineIndicator variant="warning" />
				<TimelineHeading>UI Lab v0.1.0</TimelineHeading>
				<TimelineSubheading>
					<DateFormat date={new Date(2023, 10, 15)} />
				</TimelineSubheading>
				<TimelineContent>
					Those great big fluffy clouds. You can create the world you want to see and be a part of.
					You have that power.
				</TimelineContent>
			</TimelineItem>

			<TimelineItem>
				<TimelineIndicator variant="success" />
				<TimelineHeading>UI Lab v0.0.1</TimelineHeading>
				<TimelineSubheading>
					<DateFormat date={new Date(2023, 8, 10)} />
				</TimelineSubheading>
				<TimelineContent>
					Get started with dozens of UI components and interactive elements built with React &
					Tailwind CSS.
				</TimelineContent>
			</TimelineItem>

			<TimelineItem>
				<TimelineIndicator icon={<Icon name="Circle" className="text-white" />} />
				<TimelineHeading>Lorem ipsum</TimelineHeading>
				<TimelineSubheading>with subheading</TimelineSubheading>
				<TimelineContent>custom icon</TimelineContent>
			</TimelineItem>

			<TimelineItem>
				<TimelineIndicator imgSrc="https://www.example.com/wp-content/uploads/2019/12/Edison-Electric-Illuminating1915-1920_thumbnial-150x150.jpg.webp" />
				<TimelineHeading>Lorem ipsum</TimelineHeading>
				<TimelineContent>custom img</TimelineContent>
			</TimelineItem>
		</Timeline>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement)
		const title = canvas.getByText('UI Lab v1.0.0')
		await expect(title).toBeVisible()
		const descDate = canvas.getByText(/March 1, 2024/i)
		await expect(descDate).toBeVisible()
		const content = canvas.getByText(/There's an artist/i)
		await expect(content).toBeVisible()
		const infoIcon = canvas.getByTestId('icon-info')
		await expect(infoIcon).toBeVisible()
	},
}

export default meta

export const Default: StoryObj = {}
