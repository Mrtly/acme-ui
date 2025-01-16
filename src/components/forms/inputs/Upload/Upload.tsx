'use client'
import React, { useState } from 'react'
import { Icon } from '@/theme/Icons'
import { Avatar, AvatarImage } from 'src/utility/Avatar'
import { Label } from '@/components/forms/inputs/elements/Label'
import { cn } from '@/utils/cn'

// ------------------------------------- Upload Type

export type UploadProps = {
	label: string
	id?: string
	filetype?: 'file' | 'image'

	onUpload: (file: File | undefined) => void
	disabled?: boolean
	srOnlyLabel?: boolean
	accept?: string
	showPreview?: boolean
	error?: boolean
	required?: boolean
	showOptional?: boolean
}

// -------------------------------------  Upload

const Upload = React.forwardRef<HTMLInputElement, UploadProps>(
	(
		{
			id,
			label,
			filetype = 'file',
			disabled,
			srOnlyLabel,
			accept,
			required,
			showOptional,
			showPreview,
			error,
			onUpload,
			...props
		},
		ref
	) => {
		const styles = cn(
			'w-full h-10 flex relative border-black border rounded-md text-sm bg-white text-gray-500',
			'focusVisibleRingStyles focus-within:outline-none focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2',
			error && 'border-error',
			disabled && 'opacity-70 border-gray-500 text-gray-600'
		)

		const labelStyles = cn('mb-1 w-fit', disabled && 'text-gray-500 opacity-70')

		const filenameAreaStyles = cn(
			'p-2 w-full cursor-pointer my-auto overflow-hidden truncate',
			disabled ? 'cursor-not-allowed bg-gray-200' : 'cursor-pointer'
		)

		const buttonStyles = cn(
			'flex flex-col justify-center items-center rounded-r',
			'bg-black text-white p-2 hover:bg-brand transition-colors duration-200',
			disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
		)

		const [file, setFile] = useState<File | undefined>(undefined)
		const [preview, setPreview] = useState('')

		const acceptType = filetype === 'image' ? accept || 'image/*' : accept

		const handleUploadedFile = (e: React.FormEvent<HTMLInputElement>) => {
			const file = (e?.target as HTMLInputElement)?.files?.[0]
			setFile(file)
			if (file && filetype === 'image' && showPreview) {
				const urlImage = URL.createObjectURL(file as Blob)
				setPreview(urlImage)
			}
		}

		return (
			<>
				{file && filetype === 'image' && showPreview && preview && (
					<Avatar className="size-20 mb-2">
						<AvatarImage
							src={preview}
							alt="uploaded image preview"
							aria-label={`${file.name} preview`}
						/>
					</Avatar>
				)}
				<Label htmlFor={id} srOnly={srOnlyLabel} className={labelStyles}>
					{label}{' '}
					{!required && showOptional && (
						<span className="text-gray-500 font-normal">(optional)</span>
					)}
				</Label>
				{/* this div is not a button because it contains the input (not hidden) 
          which is the interactive element and receives the kbd focus even though it is not visible */}
				<div className={styles} onClick={() => document.getElementById(id)?.click()}>
					<input
						type="file"
						id={id}
						ref={ref}
						accept={acceptType}
						required={required}
						aria-describedby="selected-file"
						className="absolute bottom-1 right-10 opacity-0 size-0" //input not 'hidden' but not visible
						onClick={(e) => e.stopPropagation()} //important! (stops double dialog pop up)
						onChange={(e) => {
							handleUploadedFile(e)
							onUpload((e.target as HTMLInputElement).files?.[0])
						}}
						disabled={disabled}
						{...props}
					/>
					<div id="selected-file" className={filenameAreaStyles}>
						<div
							className="w-full overflow-hidden truncate"
							title={file ? file.name : 'No file selected'} //helpful tooltip for longer name that is truncated
						>
							{file ? file.name : 'No file selected'}
						</div>
					</div>
					<div className={buttonStyles}>
						<Icon name="Upload" size="md" />
					</div>
				</div>
			</>
		)
	}
)
Upload.displayName = 'Upload'

// ------------------------------------- Upload Export

export { Upload }
