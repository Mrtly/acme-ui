'use client'
import React from 'react'
import { OTPInput, SlotProps } from 'input-otp'
import { cn } from '@/utils/cn'
import { Label } from '@/components/forms/inputs/elements/Label'

// inspiration https://ui.shadcn.com/docs/components/input-otp
// using https://input-otp.rodz.dev

// OTP best practices: https://web.dev/articles/sms-otp-form

// ------------------------------------- AuthCodeInput

export type AuthCodeInputProps = {
	onChange?: () => void
	value?: string
	id?: string
	label?: string
	name?: string
	error?: boolean
	required?: boolean
	srOnlyLabel?: boolean
	descriptionId?: string
}

const AuthCodeInput = React.forwardRef<HTMLInputElement, AuthCodeInputProps>(
	(
		{
			value,
			onChange,
			id = 'six-digit-code',
			label = 'Verification code',
			name,
			srOnlyLabel,
			error,
			required,
			descriptionId,
		},
		ref
	) => {
		const styles = cn(
			'w-fit bg-white px-2 flex gap-2 border border-black rounded-md',
			'h-10', //add sizing here
			error && 'border-error'
		)

		return (
			<div>
				<Label htmlFor={id} srOnly={srOnlyLabel}>
					{label}
				</Label>
				<OTPInput
					id={id}
					ref={ref}
					value={value}
					name={name}
					onChange={onChange}
					maxLength={6}
					required={required}
					aria-describedby={descriptionId}
					render={({ slots, isFocused }) => (
						<div
							className={cn(styles, isFocused && 'border-brand ring-2 ring-offset-2 ring-brand')}
						>
							{slots.map((slot, index) => (
								<Slot key={index} {...slot} />
							))}
						</div>
					)}
				/>
			</div>
		)
	}
)

AuthCodeInput.displayName = 'AuthCodeInput'

// ------------------------------------- export

export { AuthCodeInput }

// ------------------------------------- OTPInput components

const Slot = (props: SlotProps) => {
	return (
		<div
			className={cn(
				'flex items-center justify-center relative',
				'w-4 h-6 my-2', //the overall input sizing can be changed here
				'text-xl text-gray-800 border-b border-black'
			)}
		>
			{props.char !== null && <div>{props.char}</div>}
			{props.hasFakeCaret && <FakeCaret />}
		</div>
	)
}

const FakeCaret = () => {
	return (
		<div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
			<div className="w-px h-5 bg-black" />
		</div>
	)
}
