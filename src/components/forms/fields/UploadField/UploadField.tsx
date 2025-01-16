import React from 'react'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { cn } from '@/utils/cn'
import { Upload } from '@/components/forms/inputs/Upload'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- UploadField Type

export type UploadFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	id?: string
	className?: string
	label: string
	filetype?: 'file' | 'image'
	accept?: string
	srOnlyLabel?: boolean
	placeholder?: string
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
	disabled?: boolean
	showPreview?: boolean
	required?: boolean
	showOptional?: boolean
}

// -------------------------------------  UploadField

const UploadField = <T extends FieldValues>({
	control,
	name,
	id,
	label,
	filetype = 'image',
	description,
	className,
	srOnlyLabel,
	srOnlyDescription,
	disabled,
	accept,
	showPreview = true,
	required,
	showOptional,
	...props
}: UploadFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<FormControl>
							<Upload
								filetype={filetype}
								id={id}
								label={label}
								error={!!error}
								srOnlyLabel={srOnlyLabel}
								accept={accept}
								required={required} //default false
								showOptional={showOptional} //default false
								showPreview={showPreview}
								disabled={disabled || field.disabled}
								{...props}
								ref={field.ref}
								onUpload={(file) => {
									field.onChange(file)
								}}
								//do not add field value, input is controlled
							/>
						</FormControl>
						{description && (
							<FormDescription className={cn(srOnlyDescription && 'sr-only')}>
								{description}
							</FormDescription>
						)}
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	)
}
UploadField.displayName = 'UploadField'

// ------------------------------------- UploadField Export

export { UploadField }
