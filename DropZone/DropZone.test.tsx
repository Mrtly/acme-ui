import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DropZone } from './DropZone'
import userEvent from '@testing-library/user-event'

const createMockDataTransferEvent = (
	eventType: string,
	files: File[],
	effectAllowed: string = 'move'
) => {
	const dataTransferObject = {
		dataTransfer: {
			files,
			items: files.map((file) => ({
				kind: 'file',
				type: file.type,
				getAsFile: () => file,
			})),
			types: ['Files'],
			effectAllowed,
		},
	}
	const event = new Event(eventType, { bubbles: true })
	Object.assign(event, dataTransferObject)
	return event
}

const sampleImgFile = new File(['test image'], 'testImage.png', { type: 'image/png' })

const samplePdfFilesinArray = [
	new File(['test pdf 1'], 'testPdf1.png', { type: 'application/pdf' }),
	new File(['test pdf 2'], 'testPdf2.png', { type: 'application/pdf' }),
]

describe('DropZone component', () => {
	describe('native file input', () => {
		describe('single file input', () => {
			const onSelectMock = vi.fn()

			beforeEach(() => {
				render(
					<DropZone
						acceptType="image/*"
						allowsMultiple={false}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
			})

			it('renders file input correctly', () => {
				const fileInput = screen.getByText('Drop file here')
				expect(fileInput).toBeInTheDocument()
			})

			it('fires onSelect callback when a file is selected', async () => {
				const fileInputLabel = screen.getByTestId('fileInputTestId')
				const file = sampleImgFile

				await userEvent.upload(fileInputLabel, file)

				await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))
				expect(onSelectMock).toHaveBeenCalledWith(file)
				expect(screen.getByText('File selected')).toBeInTheDocument()
				expect(screen.getByText('testImage.png')).toBeInTheDocument()
			})
		})

		describe('multiple file input', () => {
			const onSelectMock = vi.fn()

			beforeEach(() => {
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						multipleFilesLimit={3}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
			})

			it('fires onSelect callback when multiple files are selected (allowsMultiple)', async () => {
				const fileInputLabel = screen.getByTestId('fileInputTestId')
				const files = samplePdfFilesinArray

				await userEvent.upload(fileInputLabel, files)

				await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))
				expect(onSelectMock).toHaveBeenCalledWith(files)
				expect(screen.getByText('Files selected')).toBeInTheDocument()
				expect(screen.getByText('testPdf1.png')).toBeInTheDocument()
				expect(screen.getByText('testPdf2.png')).toBeInTheDocument()
			})

			it('should error if more than the specified limit of files are selected', async () => {
				const fileInputLabel = screen.getByTestId('fileInputTestId')
				const files = [
					new File(['test pdf 1'], 'testPdf1.png', { type: 'application/pdf' }),
					new File(['test pdf 2'], 'testPdf2.png', { type: 'application/pdf' }),
					new File(['test pdf 3'], 'testPdf3.png', { type: 'application/pdf' }),
					new File(['test pdf 4'], 'testPdf4.png', { type: 'application/pdf' }),
				]

				await userEvent.upload(fileInputLabel, files)

				expect(screen.getByText('Max number of files accepted: 3')).toBeInTheDocument()
			})
		})
	})

	describe('drop functionality', () => {
		describe('allows single file', () => {
			const onSelectMock = vi.fn()
			let dropzone: HTMLElement

			beforeEach(() => {
				render(
					<DropZone
						acceptType="image/*"
						allowsMultiple={false}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
				dropzone = screen.getByTestId('dropzoneTestId')
				expect(dropzone).toHaveAttribute('data-status', 'default')
			})

			it('handles file drop (single file)', async () => {
				expect(dropzone).toHaveAttribute('data-status', 'default')
				const file = sampleImgFile

				const dropEvent = createMockDataTransferEvent('drop', [file], 'move')

				fireEvent(dropzone, dropEvent)

				// onSelect is called with the one file (not an array)
				await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))
				expect(onSelectMock).toHaveBeenCalledWith(file)
				expect(dropzone).toHaveAttribute('data-status', 'success')

				expect(screen.getByText('File selected')).toBeInTheDocument()
				expect(screen.getByText('testImage.png')).toBeInTheDocument()
			})

			it('should not allow multiple files to be selected if allowsMultiple is false', async () => {
				expect(dropzone).toHaveAttribute('data-status', 'default')
				// sim file drop event with multiple files
				const files = samplePdfFilesinArray

				const dropEvent = createMockDataTransferEvent('drop', files, 'move')

				fireEvent(dropzone, dropEvent)
				await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))

				expect(dropzone).toHaveAttribute('data-status', 'error')
				expect(screen.queryByText('File selected')).not.toBeInTheDocument()
				expect(screen.getByText('Could not select file')).toBeInTheDocument()
			})

			it('should replace the selected file if another file is dropped', async () => {
				expect(dropzone).toHaveAttribute('data-status', 'default')
				const file = sampleImgFile
				const dropEvent = createMockDataTransferEvent('drop', [file], 'move')

				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))
				expect(onSelectMock).toHaveBeenCalledWith(file)
				expect(dropzone).toHaveAttribute('data-status', 'success')
				expect(screen.getByText('File selected')).toBeInTheDocument()
				expect(screen.getByText('testImage.png')).toBeInTheDocument()
			})

			it('should reject files with incorrect mime type', async () => {
				const pdfFile = new File(['test pdf'], 'test.pdf', { type: 'application/pdf' })
				const dropEvent = createMockDataTransferEvent('drop', [pdfFile], 'move')

				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(screen.getByText('Could not select file')).toBeInTheDocument())
				expect(screen.getByText('The file type is not valid')).toBeInTheDocument()
				expect(dropzone).toHaveAttribute('data-status', 'error')
			})
		})

		describe('allows multiple files', () => {
			it('handles multiple files drop (allowsMultiple)', async () => {
				const onSelectMock = vi.fn()
				// allowsMultiple={true}
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')
				expect(dropzone).toHaveAttribute('data-status', 'default')

				const files = samplePdfFilesinArray

				const dropEvent = createMockDataTransferEvent('drop', files, 'move')

				fireEvent(dropzone, dropEvent)

				// onSelect is called with an array containing the files
				await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))
				expect(onSelectMock).toHaveBeenCalledWith(files) // array of files
				expect(dropzone).toHaveAttribute('data-status', 'success')
				expect(screen.getByText('Files selected')).toBeInTheDocument()
				expect(screen.getByText('testPdf1.png')).toBeInTheDocument()
				expect(screen.getByText('testPdf2.png')).toBeInTheDocument()
			})

			it('should handle mixed valid and invalid file types', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')

				const mixedFiles = [
					new File(['test pdf'], 'valid.pdf', { type: 'application/pdf' }),
					new File(['test image'], 'invalid.png', { type: 'image/png' }),
				]

				const dropEvent = createMockDataTransferEvent('drop', mixedFiles, 'move')
				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).not.toHaveBeenCalled())
				expect(screen.getByText('Could not select file')).toBeInTheDocument()
				expect(screen.getByText('The file type is not valid')).toBeInTheDocument()
				expect(dropzone).toHaveAttribute('data-status', 'error')
			})

			it('should handle empty file drop', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')

				const dropEvent = createMockDataTransferEvent('drop', [], 'move')
				fireEvent(dropzone, dropEvent)

				expect(onSelectMock).not.toHaveBeenCalled()
				expect(screen.getByText('Drop files here')).toBeInTheDocument()
				expect(dropzone).toHaveAttribute('data-status', 'default')
			})
		})

		describe('file size validation', () => {
			it('should handle large file sizes - single file', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
						maxSizeInBytes={1000} // 1KB limit
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')

				const largeFile = new File(['x'.repeat(2000)], 'large.pdf', { type: 'application/pdf' })
				await new Promise((resolve) => setTimeout(resolve, 100)) // wait for the file to be created
				const dropEvent = createMockDataTransferEvent('drop', [largeFile], 'move')

				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).not.toHaveBeenCalled())
				expect(screen.getByText(/The file is too large/)).toBeInTheDocument()
				expect(dropzone).toHaveAttribute('data-status', 'error')
			})

			it('should handle large file sizes - multiple files', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
						maxSizeInBytes={1000}
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')

				const largeFiles = [
					new File(['x'.repeat(2000)], 'large1.pdf', { type: 'application/pdf' }),
					new File(['y'.repeat(2000)], 'large2.pdf', { type: 'application/pdf' }),
				]
				await new Promise((resolve) => setTimeout(resolve, 100)) // wait for the files to be created

				const dropEvent = createMockDataTransferEvent('drop', largeFiles, 'move')
				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).not.toHaveBeenCalled())
				expect(screen.getByText(/The file is too large/)).toBeInTheDocument()
				expect(dropzone).toHaveAttribute('data-status', 'error')
			})
		})

		describe('file type validation', () => {
			it('should handle invalid file types - single file', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')

				const invalidFile = new File(['test image'], 'invalid.png', { type: 'image/png' })
				const dropEvent = createMockDataTransferEvent('drop', [invalidFile], 'move')

				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).not.toHaveBeenCalled())
				expect(screen.getByText('Could not select file')).toBeInTheDocument()
			})

			it('should handle invalid file types - multiple files', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf, image/png"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')

				const invalidFiles = [
					new File(['test image'], 'validImg.png', { type: 'image/png' }),
					new File(['test pdf'], 'validPdf.pdf', { type: 'application/pdf' }),
					new File(['test text'], 'invalidText.pdf', { type: 'text/plain' }),
				]

				const dropEvent = createMockDataTransferEvent('drop', invalidFiles, 'move')
				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).not.toHaveBeenCalled())
				expect(screen.getByText('Could not select file')).toBeInTheDocument()
				expect(dropzone).toHaveAttribute('data-status', 'error')
			})

			it('should handle valid file types - multiple files', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf, image/png"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
					/>
				)
				const dropzone = screen.getByTestId('dropzoneTestId')

				const validFiles = [
					new File(['test image'], 'validImg.png', { type: 'image/png' }),
					new File(['test pdf'], 'validPdf.pdf', { type: 'application/pdf' }),
				]

				const dropEvent = createMockDataTransferEvent('drop', validFiles, 'move')
				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).toHaveBeenCalledTimes(1))
				expect(onSelectMock).toHaveBeenCalledWith(validFiles)
				expect(dropzone).toHaveAttribute('data-status', 'success')
				expect(screen.getByText('Files selected')).toBeInTheDocument()
				expect(screen.getByText('validImg.png')).toBeInTheDocument()
				expect(screen.getByText('validPdf.pdf')).toBeInTheDocument()
			})

			it('should handle multiple files limit', async () => {
				const onSelectMock = vi.fn()
				render(
					<DropZone
						acceptType="application/pdf"
						allowsMultiple={true}
						onSelect={onSelectMock}
						onRemove={() => {}}
						multipleFilesLimit={2}
					/>
				)

				const dropzone = screen.getByTestId('dropzoneTestId')

				const files = [
					new File(['test pdf 1'], 'testPdf1.png', { type: 'application/pdf' }),
					new File(['test pdf 2'], 'testPdf2.png', { type: 'application/pdf' }),
					new File(['test pdf 3'], 'testPdf3.png', { type: 'application/pdf' }),
				]

				const dropEvent = createMockDataTransferEvent('drop', files, 'move')
				fireEvent(dropzone, dropEvent)

				await waitFor(() => expect(onSelectMock).not.toHaveBeenCalled())
				expect(screen.getByText('Could not select file')).toBeInTheDocument()
				expect(screen.getByText('Max number of files accepted: 2')).toBeInTheDocument()
				expect(dropzone).toHaveAttribute('data-status', 'error')
			})
		})
	})

	describe('onRemove functionality', () => {
		it('should call onRemove when removing files', async () => {
			const onRemoveMock = vi.fn()
			render(
				<DropZone
					acceptType="image/*"
					onRemove={onRemoveMock}
					onSelect={() => {}}
					allowsMultiple={true}
				/>
			)
			const dropzone = screen.getByTestId('dropzoneTestId')
			expect(dropzone).toHaveAttribute('data-status', 'default')
			const input = screen.getByTestId('fileInputTestId')
			const file = new File(['image'], 'image.png', { type: 'image/png' })
			await userEvent.upload(input, file)
			expect(dropzone).toHaveAttribute('data-status', 'success')

			const removeButton = screen.getByRole('button', { name: /remove file/i })
			await userEvent.click(removeButton)

			expect(onRemoveMock).toHaveBeenCalled()
			expect(screen.getByText('Drop files here')).toBeInTheDocument()
			expect(dropzone).toHaveAttribute('data-status', 'default')
		})
	})

	describe('custom error text', () => {
		it('should display custom error text', async () => {
			render(
				<DropZone
					status="error"
					customErrorText="Custom error message"
					onRemove={() => {}}
					onSelect={() => {}}
				/>
			)
			const dropzone = screen.getByTestId('dropzoneTestId')

			expect(dropzone).toHaveAttribute('data-status', 'error')
			expect(screen.getByText('Custom error message')).toBeInTheDocument()
		})
	})

	describe('keyboard navigation', () => {
		it('the input label / browse button should be focusable', async () => {
			const onSelectMock = vi.fn()
			render(<DropZone acceptType="image/*" onSelect={onSelectMock} onRemove={() => {}} />)

			const dropzone = screen.getByTestId('dropzoneTestId')
			await userEvent.click(dropzone)
			await userEvent.tab()

			expect(screen.getByRole('button', { name: /browse/i })).toHaveFocus()
		})
	})
})
