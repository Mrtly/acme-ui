import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CodeBlock } from './CodeBlock'

const example = `<div className="p-8 flex flex-col gap-4">
  <Heading as="h1" className="text-brand">
    Next starter app
  </h1>
  <div className={subheadingStyle}>
    a Nextjs, TypeScript & TailwindCSS starter app with the <code>@acme-gds/ui</code> library
  </div>
</div>`
const meta: Meta<typeof CodeBlock> = {
	title: 'Visualization/CodeBlock',
	render: ({ ...args }) => (
		<CodeBlock code={example} darkMode={args.darkMode} filename={args.filename} />
	),
	args: {
		darkMode: true,
		filename: 'App.tsx',
	},
}

export default meta

type Story = StoryObj<typeof CodeBlock>

export const Default: Story = {}
