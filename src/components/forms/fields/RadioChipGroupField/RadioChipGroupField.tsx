import React from 'react'
import { FormField, FormItem, FormControl, FormMessage, FormDescription } from '@/forms/Form'
import { Control, FieldValues, Path } from 'react-hook-form'
import {
	RadioChipGroup,
	RadioChipGroupSection,
	RadioChip,
} from '@/components/forms/inputs/RadioChipGroup'
import { IconProps } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// ------------------------------------- RadioChipGroupFieldProps

export type RadioChipGroupFieldProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	className?: string
	legend: string
	children: React.ReactNode
	description?: string | React.ReactNode
	srOnlyLegend?: boolean
	srOnlyDescription?: boolean
	disabled?: boolean
	required?: boolean
}

// ------------------------------------- RadioChipGroupField

const RadioChipGroupField = <T extends FieldValues>({
	control,
	name,
	legend,
	srOnlyLegend,
	description,
	srOnlyDescription,
	className,
	children,
	disabled,
	required = true,
	...props
}: RadioChipGroupFieldProps<T>) => {
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
							<RadioChipGroup
								legend={legend}
								error={!!error}
								disabled={disabled || field.disabled}
								srOnlyLegend={srOnlyLegend}
								required={required}
								{...props}
								ref={field.ref}
								name={field.name}
								value={field.value}
								onValueChange={field.onChange}
								onChange={field.onChange}
								onBlur={field.onBlur}
							>
								{description && (
									<FormDescription className={cn('w-full', srOnlyDescription && 'sr-only')}>
										{description}
									</FormDescription>
								)}
								{children}
							</RadioChipGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				</div>
			)}
		/>
	)
}

RadioChipGroupField.displayName = 'RadioChipGroupField'

// ------------------------------------- RadioChipGroupFieldSection

const RadioChipGroupFieldSection = ({
	label,
	children,
}: {
	label: string
	children: React.ReactNode
}) => {
	return <RadioChipGroupSection label={label}>{children}</RadioChipGroupSection>
}

// ------------------------------------- Item Props

export type ChipFieldItemProps = {
	id?: string
	label: React.ReactNode | string
	value: string
	iconName?: IconProps['name']
	disabled?: boolean
}

// ------------------------------------- RadioChipGroupFieldItem

const RadioChipGroupFieldItem = ({ id, label, value, iconName, disabled }: ChipFieldItemProps) => {
	return (
		<FormItem className="flex items-center gap-2">
			<FormControl>
				<RadioChip id={id} value={value} label={label} iconName={iconName} disabled={disabled} />
			</FormControl>
		</FormItem>
	)
}
RadioChipGroupFieldItem.displayName = 'RadioChipGroupFieldItem'

// ------------------------------------- exports

export { RadioChipGroupField, RadioChipGroupFieldSection, RadioChipGroupFieldItem }
