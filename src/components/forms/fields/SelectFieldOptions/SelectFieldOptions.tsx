import React from 'react'
import { SelectField, SelectFieldItem } from '../SelectField'
import states from './states.json'
import countries from './countries.json' //list from https://docs.rocketship.it/php/1-0/usps-country-codes.html
import times from './times'
import { Control, FieldValues, Path } from 'react-hook-form'

type SelectFieldOptionsProps<T extends FieldValues> = {
	control: Control<T> //T is inferred from the Zod schema in a form zod.dev/?id=type-inference
	name: Path<T> //react-hook-form.com/ts#FieldPath
	options: 'state' | 'country' | 'time'
	id: string
	label: string
	className?: string
	srOnlyLabel?: boolean
	placeholder?: string
	description?: string
	srOnlyDescription?: boolean
	disabled?: boolean
	readOnly?: boolean
	maxHeight?: number | undefined
	stateValueDisplayed?: 'name' | 'abbreviation'
	required?: boolean
	showOptional?: boolean
}

const SelectFieldOptions = <T extends FieldValues>({
	options,
	control,
	id,
	name,
	label,
	srOnlyLabel,
	placeholder,
	description,
	srOnlyDescription,
	className,
	disabled,
	readOnly,
	maxHeight = 340,
	stateValueDisplayed = 'abbreviation',
	required = true,
	showOptional = true,
	...props
}: SelectFieldOptionsProps<T>) => {
	return (
		<SelectField
			control={control}
			name={name}
			id={id}
			label={label}
			srOnlyLabel={srOnlyLabel}
			description={description}
			placeholder={placeholder || `Select ${options}`}
			srOnlyDescription={srOnlyDescription}
			disabled={disabled}
			readOnly={readOnly}
			maxHeight={maxHeight}
			showTrueValue={stateValueDisplayed === 'abbreviation'}
			className={className}
			required={required} //default true
			showOptional={showOptional} //default true, if !required, the label will render '(optional)'
			{...props}
		>
			{options === 'state' &&
				states.map((state, i) => {
					return (
						<SelectFieldItem key={state.abbreviation + i} value={state.abbreviation}>
							{state.name}
						</SelectFieldItem>
					)
				})}
			{options === 'country' &&
				countries.map((country, i) => {
					return (
						<SelectFieldItem key={country.name + i} value={country.name}>
							{country.name}
						</SelectFieldItem>
					)
				})}
			{options === 'time' &&
				times.map((time, i) => {
					return (
						<SelectFieldItem key={time + i} value={time}>
							{time}
						</SelectFieldItem>
					)
				})}
		</SelectField>
	)
}

export { SelectFieldOptions }
