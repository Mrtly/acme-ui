import React from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import { RadioGroup, Radio } from '@/components/forms/inputs/RadioGroup'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { cn } from '@/utils/cn'

// ------------------------------------- RadioGroupField Type

export type RadioGroupFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	legend: string
	description?: string | React.ReactNode
	srOnlyLegend?: boolean
	srOnlyDescription?: boolean
	children: React.ReactNode
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	orientation?: 'vertical' | 'horizontal'
}

// ------------------------------------- RadioGroupField

const RadioGroupField = <T extends FieldValues>({
	control,
	name,
	legend,
	description,
	srOnlyLegend,
	srOnlyDescription,
	className,
	children,
	disabled,
	readOnly,
	required = true,
	showOptional = true,
	orientation = 'vertical',
	...props
}: RadioGroupFieldProps<T>) => {
	const styles = cn(['flex flex-col gap-1', className])

	return (
		<FormField
			control={control}
			name={name}
			disabled={disabled}
			render={({ field, fieldState: { error } }) => (
				<div>
					<FormItem className={styles}>
						<FormControl>
							<RadioGroup
								legend={legend}
								error={!!error}
								readOnly={readOnly}
								required={required} //default true
								showOptional={showOptional} //default true
								srOnlyLegend={srOnlyLegend}
								orientation={orientation}
								disabled={disabled || field.disabled}
								{...props}
								isInvalid={!!error}
								name={field.name}
								value={field.value ?? null} //ensure value is never undefined
								onChange={field.onChange}
								onBlur={field.onBlur}
							>
								{description && (
									<FormDescription className={cn('w-full', srOnlyDescription && 'sr-only')}>
										{description}
									</FormDescription>
								)}
								{children}
							</RadioGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	)
}

// ------------------------------------- RadioGroupFieldItem Type

export type RadioGroupFieldItemProps = {
	id?: string
	label: React.ReactNode | string
	value: string
	disabled?: boolean
}

// ------------------------------------- RadioGroupFieldItem

const RadioGroupFieldItem = ({ id, label, value, disabled }: RadioGroupFieldItemProps) => {
	return (
		<FormItem className="flex items-center gap-2">
			<FormControl>
				<Radio id={id} value={value} label={label} disabled={disabled} />
			</FormControl>
		</FormItem>
	)
}

// ------------------------------------- Radio Group Field Exports

export { RadioGroupField, RadioGroupFieldItem }
