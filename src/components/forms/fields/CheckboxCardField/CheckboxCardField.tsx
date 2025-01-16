import React from 'react'
import { CheckboxCard } from '@/components/forms/inputs/CheckboxCard'
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '@/utils/cn'

export type CheckboxCardFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	id?: string
	label: string
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	defaultChecked?: boolean
	rightSlot?: React.ReactNode //content on the right side of the checkbox card
}

const CheckboxCardField = <T extends FieldValues>({
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
	rightSlot,
	...props
}: CheckboxCardFieldProps<T>) => {
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
							<CheckboxCard
								id={id}
								label={label}
								error={!!error}
								readOnly={readOnly}
								required={required} //default true
								showOptional={showOptional} //default true, if !required, the label will render '(optional)'
								defaultChecked={defaultChecked}
								rightSlot={rightSlot}
								disabled={disabled || field.disabled}
								{...props}
								checked={field.value ?? false} //ensure value is never undefined
								{...field}
							>
								{description && (
									<FormDescription className={cn(srOnlyDescription && 'sr-only')}>
										{description}
									</FormDescription>
								)}
								<FormMessage />
							</CheckboxCard>
						</FormControl>
					</FormItem>
				</div>
			)}
		/>
	)
}

CheckboxCardField.displayName = 'CheckboxCardField'

export { CheckboxCardField }
