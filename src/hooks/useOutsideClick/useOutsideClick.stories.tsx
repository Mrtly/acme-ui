import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CodeBlock } from '@/components/visualization/CodeBlock'

const Demo = () => {
	return (
		<div className="flex flex-col gap-4">
			<h1>
				<code>useOutsideClick()</code>
			</h1>

			<CodeBlock lang="jsx" code={`useOutsideClick(elementRef, callback)`} />
		</div>
	)
}

const meta: Meta = {
	title: 'Hooks/useOutsideClick',
	render: () => <Demo />,
}

export default meta

export const Default: StoryObj = {}
