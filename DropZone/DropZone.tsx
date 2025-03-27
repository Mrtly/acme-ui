'use client'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'
import React, { useState, useRef, useCallback, RefAttributes } from 'react'
import {
	FileTrigger,
	Button,
	DropZone as RACDropZone,
	DropZoneProps as RACDropZoneProps,
} from 'react-aria-components'

type DropZoneProps = RACDropZoneProps & {
	onSelect: (files: File | File[]) => void
	onRemove: () => void
	allowsMultiple?: boolean
	multipleFilesLimit?: number
	acceptType?: string
	maxSizeInBytes?: number | null
	status?: 'default' | 'error' | 'success'
	customErrorText?: string
	className?: string
	textContent?: {
		dropFileSingle?: string
		dropFilesMultiple?: string
		browse?: string
		maxFileSizeIs?: string
		couldNotSelect?: string
		canOnlySelectOneFile?: string
		fileTooLarge?: string
		fileTypeNotValid?: string
		defaultErrorText?: string
		acceptedTypesText?: string
		filesLimit?: string
	}
} & RefAttributes<HTMLButtonElement>

const formatBytes = (bytes: number, decimals: number = 2): string => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

const defaultTextContent = {
	dropFileSingle: 'Drop file here',
	dropFilesMultiple: 'Drop files here',
	browse: 'Browse',
	maxFileSizeIs: 'Max file size',
	couldNotSelect: 'Could not select file',
	canOnlySelectOneFile: 'You can only select one file',
	fileTooLarge: 'The file is too large',
	fileTypeNotValid: 'The file type is not valid',
	defaultErrorText: 'An error occurred. Please try again.',
	acceptedTypesText: 'Acceptes any file type',
	filesLimit: 'Max number of files accepted:',
}

const DropZone: React.FC<DropZoneProps> = ({
	allowsMultiple,
	multipleFilesLimit = 10,
	acceptType = '/*',
	maxSizeInBytes = null,
	status = 'default',
	onSelect,
	onRemove,
	customErrorText,
	ref,
	className,
	textContent = defaultTextContent,
	...props
}) => {
	const [currentStatus, setCurrentStatus] = useState<'default' | 'error' | 'success'>(status)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])

	const [multipleFilesError, setMultipleFilesError] = useState(false)
	const [fileSizeError, setFileSizeError] = useState(false)
	const [fileTypeError, setFileTypeError] = useState(false)
	const [filesLimitError, setFilesLimitError] = useState(false)

	const fileInputRef = useRef<HTMLInputElement>(null)

	const clearErrors = () => {
		setMultipleFilesError(false)
		setFileSizeError(false)
		setFileTypeError(false)
		setFilesLimitError(false)
	}

	const isSingleFile = (fileList: FileList | File[]) => {
		if (fileList.length > 1) {
			setMultipleFilesError(true)
			setCurrentStatus('error')
			return false
		}
		return true
	}

	const isMultipleFilesLimitValid = (fileList: FileList | File[]) => {
		if (multipleFilesLimit && fileList.length > multipleFilesLimit) {
			setFilesLimitError(true)
			setCurrentStatus('error')
			return false
		}
		return true
	}

	const isFileSizeValid = (file: File) => {
		if (maxSizeInBytes && file.size > maxSizeInBytes) {
			setFileSizeError(true)
			setCurrentStatus('error')
			return false
		}
		return true
	}

	const isFileTypeValid = (file: File) => {
		// If the file has no MIME type, it's difficult to validate, so we'll return true (assuming it's valid)
		if (!file.type) return true

		// If acceptType is a wildcard ('*/*'), accept all file types
		if (acceptType === '/*') return true

		// Split the acceptType string into individual types, handle multiple types separated by commas
		const acceptedTypes = acceptType.split(',').map((type) => type.trim())

		// Check each accepted type
		for (const acceptedType of acceptedTypes) {
			// Exact match check
			if (file.type === acceptedType) {
				return true
			}

			// Handle wildcard types, like "image/*"
			if (acceptedType.includes('*')) {
				const [typePrefix] = acceptedType.split('/')
				const [filePrefix] = file.type.split('/')
				if (typePrefix === filePrefix) {
					return true
				}
			}
		}

		setFileTypeError(true)
		setCurrentStatus('error')
		return false
	}

	const emitFilesArrayToParent = (files: File[]) => {
		if (onSelect) {
			if (files?.length > 1) {
				onSelect(files)
			}
			if (files?.length == 1) {
				onSelect(files[0])
			}
		}
		setCurrentStatus('success')
	}

	const removeAllFiles = () => {
		setSelectedFiles([])
		onRemove && onRemove()
		setCurrentStatus('default')
		clearErrors()
	}

	const onSelectFile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		clearErrors()
		const fileList = event.target.files
		if (!fileList) return
		const filesArray = Array.from(fileList)

		if (!isMultipleFilesLimitValid(filesArray)) return
		if (!allowsMultiple && !isSingleFile(filesArray)) return // Only proceed if one file is selected.

		const validFiles: File[] = []

		filesArray.forEach((file) => {
			if (isFileTypeValid(file) && isFileSizeValid(file)) {
				validFiles.push(file)
			}
		})

		if (validFiles.length > 0) {
			setSelectedFiles(validFiles)
			emitFilesArrayToParent(validFiles)
		}
	}, [])

	const displayText = () => {
		if (currentStatus === 'default') {
			return allowsMultiple ? textContent.dropFilesMultiple : textContent.dropFileSingle
		} else if (currentStatus === 'error') return textContent.couldNotSelect
		else if (currentStatus === 'success')
			return selectedFiles.length > 1 ? 'Files selected' : 'File selected'
		return ''
	}

	const subText = () => {
		if (currentStatus === 'error') {
			if (customErrorText) return customErrorText
			if (filesLimitError) return `${textContent.filesLimit} ${multipleFilesLimit}`
			if (multipleFilesError) return textContent.canOnlySelectOneFile
			if (fileSizeError)
				return `${textContent.fileTooLarge} Max size is ${formatBytes(maxSizeInBytes as number)}`
			if (fileTypeError) return textContent.fileTypeNotValid
			return textContent.defaultErrorText
		}

		if (currentStatus === 'default') {
			const mainRestriction = acceptType !== '/*' ? `${textContent.acceptedTypesText}` : ''

			return (
				<>
					<div>{mainRestriction}</div>
					<div>
						{maxSizeInBytes && `${textContent.maxFileSizeIs} ${formatBytes(maxSizeInBytes)}`}
					</div>
					<div>
						{allowsMultiple &&
							multipleFilesLimit &&
							`${textContent.filesLimit} ${multipleFilesLimit}`}
					</div>
				</>
			)
		}

		return ''
	}

	// using any type because RAC does not export the onDrop type
	// eslint-disable-next-line
	const onDrop = useCallback(async (e: any) => {
		// @ts-expect-error - using unknown type because RAC does not export the onDrop type
		const filesArray = e.items.filter((file: unknown) => file.kind === 'file')
		if (filesArray.length === 0) return //clear files & errors when new drop occurs

		setSelectedFiles([])
		emitFilesArrayToParent([])
		clearErrors()

		if (!isMultipleFilesLimitValid(filesArray)) return

		if (!allowsMultiple && filesArray.length > 1) {
			setMultipleFilesError(true)
			setCurrentStatus('error')
			return
		}

		const actualFiles = await Promise.all(
			filesArray.map(async (item: unknown) => {
				// @ts-expect-error - using unknown type because RAC does not export the onDrop type
				const result = await item.getFile()
				return result
			})
		)

		const validFiles: File[] = []
		let errorOccurred = false

		actualFiles.forEach((file) => {
			if (isFileTypeValid(file) && isFileSizeValid(file)) {
				validFiles.push(file)
			} else {
				errorOccurred = true
			}
		})

		if (validFiles.length > 0 && !errorOccurred) {
			setSelectedFiles(validFiles)
			emitFilesArrayToParent(validFiles)
		} else {
			setSelectedFiles([])
			setCurrentStatus('error')
		}
	}, [])

	const dropzoneStyles = cn(
		'w-full flex flex-col items-center justify-center text-center p-4 bg-white',
		'min-w-60 border-2 border-dashed rounded-md focusVisibleRingStyles',
		'transition-colors duration-200',
		className,
		{
			'border-primary-500': currentStatus === 'default',
			'border-error-500': currentStatus === 'error',
			'border-success-500': currentStatus === 'success',
			'bg-accent-blue-100': currentStatus !== 'success',
		}
	)

	const getAriaLabel = () => {
		return `File upload area. ${textContent.dropFileSingle}. Accepted files: ${acceptType}`
	}

	return (
		<RACDropZone
			{...props}
			onDrop={onDrop}
			aria-label={getAriaLabel()}
			className={({ isDropTarget }) =>
				cn(dropzoneStyles, isDropTarget ? 'bg-accent-blue-100' : 'bg-white')
			}
			data-testid="dropzoneTestId"
			data-status={currentStatus}
			aria-live="polite"
		>
			<Icon
				size="xl"
				name={
					currentStatus === 'default'
						? 'Upload'
						: currentStatus === 'error'
							? 'XCircle'
							: 'CheckCircle'
				}
				className={cn(
					currentStatus === 'default'
						? 'text-gray-600'
						: currentStatus === 'error'
							? 'text-error-500'
							: 'text-success-500'
				)}
			/>
			<div role="status" className="mt-2 text-gray-700">
				<div className="font-medium">{displayText()}</div>
				<div className="mt-1 font-light text-sm max-w-sm">
					{currentStatus === 'default' || currentStatus === 'error' ? <div>{subText()}</div> : null}
					{currentStatus === 'success' &&
						selectedFiles.length > 0 &&
						selectedFiles.map((file) => (
							<div key={file.name} className="text-gray-500">
								<span className="font-light break-all">{file.name}</span>
							</div>
						))}
				</div>
			</div>

			{!selectedFiles.length && (
				<FileTrigger
					allowsMultiple={allowsMultiple}
					onSelect={(files) => {
						if (!files) return
						onSelectFile({ target: { files } } as React.ChangeEvent<HTMLInputElement>)
					}}
					ref={fileInputRef}
					data-testid="fileInputTestId"
				>
					<Button
						ref={ref}
						className="mt-4 flex items-center gap-2 rounded-md px-4 h-[32px] bg-primary-500 text-white cursor-pointer focusVisibleRingStyles"
					>
						<Icon name="Folder" /> {textContent.browse}
					</Button>
				</FileTrigger>
			)}

			{currentStatus === 'success' && (
				<button
					type="button"
					className="mt-4 underline text-gray-500 text-sm font-light"
					onClick={(e) => {
						e.stopPropagation()
						removeAllFiles()
					}}
				>
					{selectedFiles.length > 1 ? 'Remove files' : 'Remove file'}
				</button>
			)}
		</RACDropZone>
	)
}

export { DropZone, type DropZoneProps, defaultTextContent }
