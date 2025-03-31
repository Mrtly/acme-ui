import type { ReactNode } from 'react'
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectItem,
	MultiSelectItemType,
	MultiSelectTrigger,
} from '@/components/inputs/MultiSelect/MultiSelect'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- MultiSelect Type

export type MultiSelectFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	label: string
	children: ReactNode
	id?: string
	placeholder?: string
	description?: string | ReactNode
	srOnlyLabel?: boolean
	srOnlyDescription?: boolean
	disabled?: boolean
	maxHeight?: number
	required?: boolean
	showOptional?: boolean
	className?: string
}

// a default value may be set via the RGF defaultValues

// ------------------------------------- MultiSelect

/** A select input field element for multiple selection - used in Form. */
const MultiSelectField = <T extends FieldValues>({
	control,
	name,
	label,
	children,
	id,
	placeholder,
	description,
	srOnlyLabel,
	srOnlyDescription,
	disabled,
	required = true,
	showOptional = true,
	className,
	...props
}: MultiSelectFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<MultiSelect
							label={label}
							id={id}
							placeholder={placeholder}
							srOnlyLabel={srOnlyLabel}
							disabled={disabled}
							required={required}
							showOptional={showOptional}
							className={className}
							error={!!error}
							{...props}
							{...field}
						>
							<FormControl>
								<MultiSelectTrigger ref={field.ref} />
							</FormControl>
							<MultiSelectContent>{children}</MultiSelectContent>
						</MultiSelect>
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

MultiSelectField.displayName = 'MultiSelectField'

// ------------------------------------- MultiSelect Field Item

export type MultiSelectFieldItemProps = { item: MultiSelectItemType; disabled?: boolean }

/** Used in a MultiSelectField. Has the role of "toggle button" with the "aria-pressed" property. Items must have 'id' and 'name' properties. */
const MultiSelectFieldItem = ({ item, disabled }: MultiSelectFieldItemProps) => {
	return <MultiSelectItem item={item} disabled={disabled} />
}

// ------------------------------------- MultiSelect Field Exports

export { MultiSelectField, MultiSelectFieldItem }
