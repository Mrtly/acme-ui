import React from 'react'
import { Checkbox } from '@/components/forms/inputs/Checkbox'
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '@/utils/cn'

export type CheckboxFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	id: string
	label: string
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	defaultChecked?: boolean
}

const CheckboxField = <T extends FieldValues>({
	control,
	name,
	id,
	label,
	description,
	srOnlyDescription,
	className,
	disabled,
	readOnly,
	required,
	showOptional,
	defaultChecked,
	...props
}: CheckboxFieldProps<T>) => {
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
							<Checkbox
								id={id}
								label={label}
								error={!!error}
								readOnly={readOnly}
								className="max-w-max"
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								defaultChecked={defaultChecked}
								disabled={disabled || field.disabled}
								{...props}
								checked={field.value ?? false} //ensure value is never undefined
								{...field}
							></Checkbox>
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

CheckboxField.displayName = 'CheckboxField'

export { CheckboxField }
