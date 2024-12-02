import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { cn } from '.'
import { CodeBlock } from '@/components/visualization/CodeBlock'

const CnDemo = () => {
	const class1 = 'flex w-full p-1'
	const class2 = 'bg-purple flex'
	const cnResult = cn(class1, class2)

	return (
		<div className="flex flex-col gap-4">
			<h1>
				<code>cn()</code> utility function
			</h1>

			<CodeBlock
				lang="jsx"
				code={`const class1 = 'flex w-full p-1'
const class2 = 'bg-purple flex'
const cnResult = cn(class1, class2)`}
			/>
			<div>
				<code>cnResult: {cnResult}</code>
			</div>
		</div>
	)
}

const meta: Meta = {
	title: 'Utils/cn',
	render: () => <CnDemo />,
}

export default meta

export const Default: StoryObj = {}
