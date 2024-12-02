import React from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectSection,
} from '@/components/forms/inputs/Select/Select'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- Select Type

export type SelectFieldProps<T extends FieldValues> = {
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
	canClearSelection?: boolean
	/**
	 * displays the string passed as `value` to the item, not its children value (default)
	 */
	showTrueValue?: boolean
	required?: boolean
	maxHeight?: number
	defaultValue?: string
	showOptional?: boolean
}

// ------------------------------------- Select

const SelectField = <T extends FieldValues>({
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
	canClearSelection,
	maxHeight,
	showTrueValue,
	required = true,
	showOptional = true,
	defaultValue,
	...props
}: SelectFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-2', className])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div className={styles}>
					<FormItem>
						<Select
							label={label}
							readOnly={readOnly}
							required={required} //default true
							showOptional={showOptional} //default true, if !required, the label will render '(optional)'
							placeholder={placeholder}
							srOnlyLabel={srOnlyLabel}
							disabled={disabled || field.disabled}
							{...props}
							name={field.name}
							defaultSelectedKey={defaultValue}
							onSelectionChange={field.onChange}
							selectedKey={field.value ?? ''} //ensure value is never undefined
							onBlur={field.onBlur}
							// no {...field} because the attrs value, onChange, name are specified ^ (ref goes to the trigger)
						>
							<FormControl>
								<SelectTrigger
									id={id}
									error={!!error}
									showTrueValue={showTrueValue}
									ref={field.ref}
								/>
							</FormControl>
							<SelectContent maxHeight={maxHeight} canClearSelection={canClearSelection}>
								{children}
							</SelectContent>
						</Select>
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

SelectField.displayName = 'SelectField'

// ------------------------------------- Select Field Item

export type SelectFieldItemProps = {
	children: React.ReactNode
	value: string
}

const SelectFieldItem = ({ children, value }: SelectFieldItemProps) => {
	return <SelectItem value={value}>{children}</SelectItem>
}

// ------------------------------------- Select Field Exports

export { SelectField, SelectFieldItem, SelectSection as SelectFieldSection }
