import React from 'react'
import { cn } from '@/utils/cn'
import { Link } from 'src/utility/Link'
import { useMediaQuery } from '../../hooks/useMediaQuery'

function validatePhoneNumber(value: string): asserts value is '1234567890 || 11234567890' {
	const isValidPhoneNumber = /^\d{10,11}$/
	if (typeof value !== 'string' || !isValidPhoneNumber.test(value)) {
		throw new Error(
			'Phone number should be a string of 10 or 11 digits without spaces or special characters.'
		)
	}
}

const formatTextValue = (input: string): string | null => {
	if (input.length === 10) {
		const area = input.slice(0, 3)
		const prefix = input.slice(3, 6)
		const extension = input.slice(6)
		return `${area}-${prefix}-${extension}` // 123-456-7890
	}
	if (input.length === 11) {
		const countryCode = input.slice(0, 1)
		const area = input.slice(1, 4)
		const prefix = input.slice(4, 7)
		const extension = input.slice(7)
		return `${countryCode}-${area}-${prefix}-${extension}` // 1-123-456-7890
	}
	console.warn(
		'<PhoneFormat>: Phone number should be a string of 10 or 11 digits without spaces or special characters.'
	)
	return null //if input.length is not 10 or 11
}

const formatTelHref = (inputString: string): string => {
	const num = inputString.replace(/\D/g, '') // remove non numeric chars
	return num.length === 11 ? `+${num}` : num
}

type PhoneNumProp = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	phoneNum: string
}

/**
 * Displays a US phone number accessibly as `<a href="tel:..."></a>`
 * @param {string} phoneNum - a string of 10 or 11 digits without spaces or special characters
 * @example ```<PhoneFormat phoneNum="1234567890" />```
 */
const PhoneFormat = React.forwardRef<HTMLAnchorElement, PhoneNumProp>(
	({ phoneNum, ...props }, ref) => {
		let isValid
		try {
			validatePhoneNumber(phoneNum)
			isValid = true
		} catch (error) {
			// @ts-expect-error 'error' is of type 'unknown'
			console.warn(phoneNum, error.message) // Outputs: "Phone number should be a string of 10 or 11 digits without spaces or special characters."
		}

		const formattedPhoneNum = formatTextValue(phoneNum)
		const tel = formatTelHref(phoneNum)

		const isMobile = useMediaQuery('(max-width: 43em)')

		// on mobile render the phone as a link
		if (isMobile) {
			return (
				<Link
					ref={ref}
					variant="inline"
					iconName={null} //removes chevron
					href={`tel:${tel}`} // tel: creates the call link
					className={cn('text-nowrap', props.className)}
					{...props}
				>
					{isValid ? formattedPhoneNum : phoneNum}
				</Link>
			)
		}
		//default text return
		return (
			<span
				className={cn('text-nowrap', props.className)}
				{...props}
				data-testid="formatted-phone-text"
			>
				{isValid ? formattedPhoneNum : phoneNum}
			</span>
		)
	}
)
PhoneFormat.displayName = 'PhoneFormat'

export { PhoneFormat }
