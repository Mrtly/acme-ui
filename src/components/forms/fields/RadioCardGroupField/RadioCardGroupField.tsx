import React from 'react'
import { RadioCardGroup, RadioCard } from '@/components/forms/inputs/RadioCardGroup'
import { cn } from '@/utils/cn'
import { FormField, FormItem, FormControl, FormDescription, FormMessage } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'

// ------------------------------------- RadioCardGroupField

export type RadioCardGroupFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	legend: string
	description?: string | React.ReactNode
	srOnlyDescription?: boolean
	srOnlyLegend?: boolean
	children: React.ReactNode
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
	showOptional?: boolean
	orientation?: 'vertical' | 'horizontal'
}

// ------------------------------------- RadioCardGroupField

const RadioCardGroupField = <T extends FieldValues>({
	control,
	name,
	legend,
	description,
	srOnlyDescription,
	srOnlyLegend,
	className,
	children,
	disabled,
	readOnly,
	required = true,
	showOptional = true,
	orientation = 'vertical',
	...props
}: RadioCardGroupFieldProps<T>) => {
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
							<RadioCardGroup
								legend={legend}
								error={!!error}
								readOnly={readOnly}
								required={required} //default true
								showOptional={showOptional} //default true
								srOnlyLegend={srOnlyLegend}
								orientation={orientation}
								disabled={disabled || field.disabled}
								isInvalid={!!error}
								{...props}
								ref={field.ref}
								name={field.name}
								value={field.value ?? null} //ensure value is never undefined
								onChange={field.onChange}
								onBlur={field.onBlur}
							>
								{description && (
									<FormDescription className={cn(srOnlyDescription && 'sr-only')}>
										{description}
									</FormDescription>
								)}
								{children}
							</RadioCardGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	)
}

// ------------------------------------- RadioCardGroupFieldItem Type

export type RadioCardGroupFieldItemProps = {
	id?: string
	label: React.ReactNode | string
	value: string
	description?: React.ReactNode | string
	rightSlot?: React.ReactNode | string
	bottomSlot?: React.ReactNode
	disabled?: boolean
}

// ------------------------------------- RadioCardGroupFieldItem

const RadioCardGroupFieldItem = ({
	id,
	label,
	value,
	description,
	rightSlot,
	bottomSlot,
	disabled,
}: RadioCardGroupFieldItemProps) => {
	return (
		<FormItem>
			<FormControl>
				{/* label and rightSlot element are passed as props */}
				<RadioCard
					id={id}
					value={value}
					label={label}
					rightSlot={rightSlot}
					bottomSlot={bottomSlot}
					disabled={disabled}
				>
					{/* description is passed as children */}
					{description && <FormDescription>{description}</FormDescription>}
				</RadioCard>
			</FormControl>
		</FormItem>
	)
}

// ------------------------------------- RadioCardGroupField exports

export { RadioCardGroupField, RadioCardGroupFieldItem }
