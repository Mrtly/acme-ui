import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CodeBlock } from '@/components/visualization/CodeBlock'

const Demo = () => {
	return (
		<div className="flex flex-col gap-4">
			<h1>
				<code>usePrefersReducedMotion()</code>
			</h1>

			<CodeBlock lang="jsx" code={`const prefersReducedMotion = usePrefersReducedMotion()`} />
		</div>
	)
}

const meta: Meta = {
	title: 'Hooks/usePrefersReducedMotion',
	render: () => <Demo />,
}

export default meta

export const Default: StoryObj = {}
