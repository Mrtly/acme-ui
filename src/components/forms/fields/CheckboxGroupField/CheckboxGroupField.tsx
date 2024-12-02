import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { CheckboxGroup } from '@/components/forms/inputs/CheckboxGroup'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { cn } from '@/utils/cn'
import { Checkbox, type CheckboxProps } from '@/components/forms/inputs/Checkbox'
import { CheckboxCard, type CheckboxCardProps } from '@/components/forms/inputs/CheckboxCard'

// ------------------------------------- CheckboxGroupField

export type CheckboxGroupFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	label: string
	description?: string | React.ReactNode
	srOnlyLabel?: boolean
	srOnlyDescription?: boolean
	children: React.ReactNode
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	defaultValue?: string[]
}

const CheckboxGroupField = <T extends FieldValues>({
	control,
	name,
	label,
	description,
	srOnlyLabel,
	srOnlyDescription,
	className,
	children,
	disabled,
	readOnly,
	required,
	showOptional,
	defaultValue,
	...props
}: CheckboxGroupFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-1'])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div>
					<FormItem className={styles}>
						<FormControl>
							<CheckboxGroup
								label={label}
								error={!!error}
								readOnly={readOnly}
								required={required} //default true
								showOptional={showOptional} //default true
								srOnlyLabel={srOnlyLabel}
								defaultValue={defaultValue}
								className={className}
								isInvalid={!!error}
								disabled={disabled || field.disabled}
								{...props}
								ref={field.ref}
								name={field.name}
								value={field.value ?? []} //ensure value is never undefined
								onChange={field.onChange}
								onBlur={field.onBlur}
							>
								{description && (
									<FormDescription className={cn('w-full', srOnlyDescription && 'sr-only')}>
										{description}
									</FormDescription>
								)}
								{children}
							</CheckboxGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	)
}

// ------------------------------------- CheckboxGroupFieldItem

export type CheckboxGroupFieldItemProps = CheckboxProps & {
	id: string
	label: string
	value: string
	disabled?: boolean
}

const CheckboxGroupFieldItem = ({
	id,
	label,
	value,
	disabled,
	...props
}: CheckboxGroupFieldItemProps) => {
	return (
		<FormItem className="flex items-center gap-2">
			<FormControl>
				<Checkbox id={id} value={value} label={label} disabled={disabled} {...props} />
			</FormControl>
		</FormItem>
	)
}

// ------------------------------------- CheckboxGroupFieldCard

export type CheckboxGroupFieldCardProps = CheckboxCardProps & {
	id: string
	label: string
	value: string
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
}

const CheckboxGroupFieldCard = ({
	id,
	label,
	value,
	description,
	srOnlyDescription,
	...props
}: CheckboxGroupFieldCardProps) => {
	return (
		<FormItem className="flex items-center gap-2">
			<FormControl>
				<CheckboxCard id={id} value={value} label={label} {...props}>
					{description && (
						<FormDescription className={cn('w-full', srOnlyDescription && 'sr-only')}>
							{description}
						</FormDescription>
					)}
				</CheckboxCard>
			</FormControl>
		</FormItem>
	)
}

// ------------------------------------- CheckboxGroupField exports

export { CheckboxGroupField, CheckboxGroupFieldItem, CheckboxGroupFieldCard }
