import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { SwitchCard } from '@/components/forms/inputs/SwitchCard'
import { cn } from '@/utils/cn'

export type SwitchCardFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	id: string
	label: string
	srOnlyLabel?: boolean
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	defaultSelected?: boolean
	statusLabelTrue?: string
	statusLabelFalse?: string
}

const SwitchCardField = <T extends FieldValues>({
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
	statusLabelTrue,
	statusLabelFalse,
	...props
}: SwitchCardFieldProps<T>) => {
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
							<SwitchCard
								id={id}
								label={label}
								error={!!error}
								readOnly={readOnly}
								defaultSelected={defaultSelected}
								statusLabelTrue={statusLabelTrue}
								statusLabelFalse={statusLabelFalse}
								srOnlyDescription={srOnlyDescription}
								disabled={disabled || field.disabled}
								{...props}
								ref={field.ref}
								name={field.name}
								isSelected={field.value ?? false} //ensure value is never undefined
								onChange={field.onChange}
								onBlur={field.onBlur}
							>
								{description && (
									<FormDescription className={cn(srOnlyDescription && 'sr-only')}>
										{description}
									</FormDescription>
								)}
							</SwitchCard>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	)
}

SwitchCardField.displayName = 'SwitchCardField'

export { SwitchCardField }
