import * as z from 'zod'

// ------------------------------------- Password Field Validation Schemas

// 8-16 characters
// 1 or more symbols
// 1 or more capital letters
// 1 or more lowercase letters
// 1 or more numbers

// ------------------------------------- PasswordFieldSchema

//single error message

// const passowrdRules =
// 	'Password must be between 8 and 16 characters and contain at least 1 symbol, 1 uppercase letter, 1 lowercase letter, and 1 number'

// const PasswordFieldSchema = z
// 	.string()
// 	.regex(
// 		/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/,
// 		{
// 			message: passowrdRules,
// 		}
// 	)
// 	.min(8, { message: passowrdRules })
// 	.max(16, { message: passowrdRules })
// 	.refine((s) => !s.includes(' '), 'Password must not contain spaces.')

//individual error messages

const PasswordFieldSchema = z
	.string()
	.refine((s) => !s.includes(' '), {
		message: 'Password must not contain spaces.',
	})
	.refine((s) => /[a-z]/.test(s), {
		message: 'Password must contain at least one lowercase letter.',
	})
	.refine((s) => /[A-Z]/.test(s), {
		message: 'Password must contain at least one capital letter.',
	})
	.refine((s) => /\d/.test(s), {
		message: 'Password must contain at least one number.',
	})
	.refine((s) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(s), {
		message: 'Password must contain at least one symbol.',
	})
	.refine((s) => s.length >= 8, {
		message: 'Password must be at least 8 characters long.',
	})
	.refine((s) => s.length <= 16, {
		message: 'Password must be at most 16 characters long.',
	})

// ------------------------------------- PasswordFieldSchemaForStrengthIndicator (used with the PasswordStrengthIndicator component for feedback)

const PasswordFieldSchemaForStrengthIndicator = z
	.string()
	.regex(/^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/, {
		message: ' ', //message property should be present for the error to register & focus on on the field - empty string replaces any default error messages
	})
	.min(8, { message: ' ' }) //message property should be present for the error to register & focus on on the field - empty string replaces any default error messages
	.max(16, { message: 'Password must be between 8 and 16 characters.' })
	.refine((s) => !s.includes(' '), 'Password must not contain spaces.')

// ------------------------------------- PasswordFieldSchemaSignIn

const PasswordFieldSchemaSignIn = z
	.string()
	.min(1, { message: 'Enter a valid password.' })
	.refine((s) => !s.includes(' '), 'Password must not contain spaces.')

// ------------------------------------- Password Field Schema Exports

export { PasswordFieldSchema, PasswordFieldSchemaForStrengthIndicator, PasswordFieldSchemaSignIn }
