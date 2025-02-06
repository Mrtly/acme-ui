'use client'
import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Label, type LabelProps } from '@/components/forms/inputs/elements/Label'
import {
	Controller,
	ControllerProps,
	FieldPath,
	FieldValues,
	FormProvider,
	UseFormReturn,
	useFormContext,
} from 'react-hook-form'
import { cn } from '@/utils/cn'
import { z, ZodType } from 'zod'

// Inspiration: https://ui.shadcn.com/docs/components/form
// Primitives: https://www.radix-ui.com/primitives/docs/components/form

// ------------------------------------- Form
// https://react-hook-form.com/docs/formprovider

/**
 * Props for a form component.
 */
type FormProps<T extends FieldValues> = {
	/**
	 * The form methods - the object returned by useForm.
	 */

	formMethods: UseFormReturn<T>
	/**
	 * The formName is added as the aria-label of the form.
	 */
	formName: string
	/**
	 * Function called when the form is submitted.
	 * @param {z.infer<any>} data - The form data.
	 */

	onSubmit: (data: z.infer<ZodType<T>>) => void
	/**
	 * The child elements of the form.
	 */
	children: React.ReactNode
	/**
	 * Optional classes for additional styling.
	 */
	className?: string
}

//by default a form is submitted by the Enter key on any text input field
//this allows form submission with Enter key ONLY on the last input of the form
//it does not affect the behavior of checkbox, radio, select etc because it is not their default behavior to submit on enter
//this is done as a UX-improvement, to avoid accidental premature form submission (and error message overload before the user has completed the form)
const preventEnterKeySubmission = (e: React.KeyboardEvent) => {
	const inputs = Array.from(e.currentTarget.querySelectorAll('input'))
	const lastInput = inputs[inputs.length - 1]
	const target = e.target as HTMLInputElement
	if (
		e.key === 'Enter' &&
		target !== lastInput &&
		target.localName === 'input' //this makes sure the button Enter key is not blocked
	) {
		e.preventDefault()
	}
}

const Form = <T extends FieldValues>({
	formMethods,
	formName,
	onSubmit,
	children,
	className,
}: FormProps<T>) => {
	return (
		<FormProvider {...formMethods}>
			<form
				noValidate
				aria-label={formName}
				onSubmit={formMethods.handleSubmit(onSubmit)}
				onKeyDown={preventEnterKeySubmission}
				className={className}
			>
				{children}
			</form>
		</FormProvider>
	)
}

// ------------------------------------- Form Field Context

export type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
	name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

// ------------------------------------- Form Field

const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	...props
}: ControllerProps<TFieldValues, TName>) => {
	return (
		<FormFieldContext.Provider value={{ name: props.name }}>
			<Controller {...props} />
		</FormFieldContext.Provider>
	)
}

// ------------------------------------- useFormField

const useFormField = () => {
	const fieldContext = React.useContext(FormFieldContext)
	const itemContext = React.useContext(FormItemContext)
	const { getFieldState, formState } = useFormContext()

	const fieldState = getFieldState(fieldContext.name, formState)

	if (!fieldContext) {
		throw new Error('useFormField should be used within <FormField>')
	}

	const { id } = itemContext

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	}
}

export type FormItemContextValue = {
	id?: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

// ------------------------------------- Form Item Types

export type FormItemProps = React.HTMLAttributes<HTMLDivElement>

// ------------------------------------- Form Item

const FormItem = ({ className, ...props }: FormItemProps) => {
	const id = React.useId()

	return (
		<FormItemContext.Provider value={{ id }}>
			<div className={cn('flex flex-col gap-y-1', className)} {...props} />
		</FormItemContext.Provider>
	)
}

// ------------------------------------- Form Label

const FormLabel = ({ className, srOnly, ...props }: LabelProps) => {
	const { formItemId } = useFormField()

	return <Label className={className} srOnly={srOnly} {...props} htmlFor={formItemId} />
}

// ------------------------------------- Form Control Types

export type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>

// ------------------------------------- Form Control

const FormControl = ({ ...props }: FormControlProps) => {
	const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

	return (
		<Slot
			id={formItemId}
			aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
			aria-invalid={!!error}
			{...props}
		/>
	)
}

// ------------------------------------- Form Description Types

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

// ------------------------------------- Form Description

const FormDescription = ({ className, ...props }: FormDescriptionProps) => {
	const { formDescriptionId } = useFormField()

	return <p id={formDescriptionId} className={cn('text-sm text-gray-500', className)} {...props} />
}

// ------------------------------------- Form Message Types

export type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>

// ------------------------------------- Form Message

const FormMessage = ({ className, children, ...props }: FormMessageProps) => {
	const { error, formMessageId } = useFormField()
	const body = error ? String(error?.message) : children

	if (!body) {
		return null
	}

	return (
		<p id={formMessageId} className={cn('text-sm font-medium text-error', className)} {...props}>
			{body}
		</p>
	)
}

// ------------------------------------- Form Exports

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }
