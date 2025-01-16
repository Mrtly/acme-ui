import React from 'react'
import { Switch } from '@/components/forms/inputs/Switch'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

export type SwitchFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	id?: string
	label: string
	srOnlyLabel?: boolean
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	defaultSelected?: boolean
}

const SwitchField = <T extends FieldValues>({
	control,
	name,
	id,
	label,
	description,
	srOnlyDescription,
	className,
	disabled,
	readOnly,
	defaultSelected,
	...props
}: SwitchFieldProps<T>) => {
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
							<Switch
								id={id}
								label={label}
								error={!!error}
								readOnly={readOnly}
								defaultSelected={defaultSelected}
								disabled={disabled || field.disabled}
								{...props}
								ref={field.ref}
								name={field.name}
								isSelected={field.value ?? false} //ensure value is never undefined
								onChange={field.onChange}
								onBlur={field.onBlur}
							></Switch>
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

SwitchField.displayName = 'SwitchField'

export { SwitchField }
