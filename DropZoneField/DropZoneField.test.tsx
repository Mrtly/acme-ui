import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form } from '../../Form'
import { DropZoneField } from './DropZoneField'
import { createMockDataTransferEvent } from '@/components/inputs/DropZone/test-helper'

const dummyFiles = [
	new File(['test1'], 'test1.txt', { type: 'text/plain' }),
	new File(['test2'], 'test2.txt', { type: 'text/plain' }),
]

const FileSchema = z.object({
	file: z.custom<File>((file) => file, {
		message: 'A file is required.',
	}),
})

const TestForm = ({ onSubmit = vi.fn(), allowsMultiple = false }) => {
	const form = useForm<z.infer<typeof FileSchema>>({
		resolver: zodResolver(FileSchema),
	})

	return (
		<Form formName="testForm" formMethods={form} onSubmit={onSubmit}>
			<DropZoneField
				control={form.control}
				name="file"
				description="Test description"
				allowsMultiple={allowsMultiple}
				isRequired={true}
			/>
			<button type="submit">Submit</button>
		</Form>
	)
}

describe('DropZoneField', () => {
	it('renders with description', () => {
		render(<TestForm />)
		expect(screen.getByText('Test description')).toBeInTheDocument()
	})

	it('shows validation error when submitting empty, does not submit', async () => {
		const onSubmit = vi.fn()
		render(<TestForm onSubmit={onSubmit} />)

		await userEvent.click(screen.getByText('Submit'))
		await waitFor(() => {
			expect(screen.getByText('A file is required.')).toBeInTheDocument()
		})
		expect(onSubmit).not.toHaveBeenCalled()
	})

	it('submits successfully with valid file via native input', async () => {
		const onSubmit = vi.fn()
		render(<TestForm onSubmit={onSubmit} />)
		const input = screen.getByTestId('fileInputTestId')
		const file = new File(['test'], 'test.txt', { type: 'text/plain' })

		await userEvent.upload(input, file)
		await userEvent.click(screen.getByText('Submit'))

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ file }), expect.anything())
		})
	})

	it('submits form with file via zone drop', async () => {
		const onSubmit = vi.fn()
		render(<TestForm onSubmit={onSubmit} />)
		const dropzone = screen.getByTestId('dropzoneTestId')
		const file = new File(['test'], 'test.txt', { type: 'text/plain' })
		const dropEvent = createMockDataTransferEvent('drop', [file], 'move')

		fireEvent(dropzone, dropEvent)
		await userEvent.click(screen.getByText('Submit'))

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ file }), expect.anything())
		})
	})

	it('submits form with multiple files when allowsMultiple is true (input)', async () => {
		const onSubmit = vi.fn()
		render(<TestForm onSubmit={onSubmit} allowsMultiple={true} />)
		const input = screen.getByTestId('fileInputTestId')
		const files = dummyFiles

		await userEvent.upload(input, files)
		await userEvent.click(screen.getByText('Submit'))

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({ file: files }),
				expect.anything()
			)
		})
	})

	it('submits form with multiple files when allowsMultiple is true (zone)', async () => {
		const onSubmit = vi.fn()
		render(<TestForm onSubmit={onSubmit} allowsMultiple={true} />)
		const dropzone = screen.getByTestId('dropzoneTestId')
		const files = dummyFiles
		const dropEvent = createMockDataTransferEvent('drop', files, 'move')

		fireEvent(dropzone, dropEvent)
		await userEvent.click(screen.getByText('Submit'))

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(
				expect.objectContaining({ file: files }),
				expect.anything()
			)
		})
	})
})
