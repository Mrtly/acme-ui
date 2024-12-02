import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Upload } from './Upload'

const Demo = () => {
	return (
		<div className="w-60">
			<Upload
				filetype="file"
				id="file-upload-story"
				label="Upload a file"
				error={false}
				disabled={false}
				srOnlyLabel={false}
				accept="*"
				required={false}
				showOptional={false}
				showPreview={false}
				onUpload={(file) => {
					console.log(file?.name)
				}}
			/>
		</div>
	)
}
const meta: Meta<typeof Upload> = {
	title: 'Forms/Inputs/Upload',
	render: () => <Demo />,
}

export default meta

type Story = StoryObj<typeof Upload>

export const Default: Story = {}
