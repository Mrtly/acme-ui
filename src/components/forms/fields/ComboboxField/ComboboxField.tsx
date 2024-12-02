import React from 'react'
import {
	Combobox,
	ComboboxContent,
	ComboboxItem,
	ComboboxTrigger,
	ComboboxSection,
} from '@/components/forms/inputs/Combobox/Combobox'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
// ------------------------------------- Combobox Type

export type ComboboxFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	id: string
	className?: string
	label: string
	srOnlyLabel?: boolean
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
	children: React.ReactNode
	placeholder?: string | undefined
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	maxHeight?: number
	defaultValue?: string
	variant?: 'default' | 'search'
}

// ------------------------------------- Combobox

const ComboboxField = <T extends FieldValues>({
	control,
	name,
	id,
	label,
	description,
	className,
	children,
	placeholder,
	disabled,
	readOnly,
	srOnlyLabel,
	srOnlyDescription,
	maxHeight,
	required = true,
	showOptional = true,
	defaultValue,
	variant = 'default',
	...props
}: ComboboxFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<Combobox
							label={label}
							readOnly={readOnly}
							required={required} //default true
							showOptional={showOptional} //default true, if !required, the label will render '(optional)'
							formValue={field.value}
							srOnlyLabel={srOnlyLabel}
							defaultSelectedKey={defaultValue}
							disabled={disabled || field.disabled}
							{...props}
							name={field.name}
							selectedKey={field.value ?? ''} //ensure value is never undefined
							onSelectionChange={field.onChange}
							onBlur={field.onBlur}
							// no {...field} because the attrs value, onChange, name are specified ^ (ref goes to the trigger)
						>
							<FormControl>
								<ComboboxTrigger
									id={id}
									error={!!error}
									placeholder={placeholder}
									ref={field.ref}
									variant={variant}
								/>
							</FormControl>
							<ComboboxContent maxHeight={maxHeight} variant={variant}>
								{children}
							</ComboboxContent>
						</Combobox>
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

ComboboxField.displayName = 'ComboboxField'

// ------------------------------------- Combobox Field Item

export type ComboboxFieldItemProps = {
	children: React.ReactNode
	value: string
	variant?: 'default' | 'search'
}

const ComboboxFieldItem = ({ children, value, variant, ...props }: ComboboxFieldItemProps) => {
	return (
		<ComboboxItem value={value} variant={variant} {...props}>
			{children}
		</ComboboxItem>
	)
}

// ------------------------------------- Combobox Field Exports

export { ComboboxField, ComboboxFieldItem, ComboboxSection as ComboboxFieldSection }
