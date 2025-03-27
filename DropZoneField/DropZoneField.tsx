import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '../../Form'
import { cn } from '@/utils/cn'
import { DropZone, DropZoneProps } from '@/components/inputs/DropZone'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- DropZone Type

export type DropZoneFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	description?: string
	srOnlyDescription?: boolean
	isRequired?: boolean
} & Omit<DropZoneProps, 'onSelect' | 'onRemove'>

// -------------------------------------  DropZone

const DropZoneField = <T extends FieldValues>({
	control,
	name,
	allowsMultiple,
	multipleFilesLimit = 10,
	acceptType = '/*',
	maxSizeInBytes = null,
	status = 'default',
	description,
	srOnlyDescription,
	customErrorText,
	isRequired,
	...props
}: DropZoneFieldProps<T>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field, fieldState: { error } }) => (
				<FormItem>
					<FormControl>
						<DropZone
							allowsMultiple={allowsMultiple}
							multipleFilesLimit={multipleFilesLimit}
							acceptType={acceptType}
							maxSizeInBytes={maxSizeInBytes}
							customErrorText={customErrorText}
							status={error ? 'error' : status}
							onSelect={field.onChange}
							onRemove={field.onChange}
							{...field}
							{...props}
							className={error && 'ring-2 ring-error-500 ring-offset-2'}
							aria-required={isRequired}
							aria-describedby={description}
						/>
					</FormControl>
					{description && (
						<FormDescription className={cn(srOnlyDescription && 'sr-only')}>
							{description}
						</FormDescription>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

// ------------------------------------- DropZoneField Export

export { DropZoneField }
