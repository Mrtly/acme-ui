import React from 'react'

const CurrencyFormat = ({ amount }: { amount: number | string }): React.ReactNode => {
	if (typeof amount === 'string') {
		// remove non-numeric characters like $ commas in '$1,120.55', convert to a floating-point number
		amount = parseFloat(amount.replace(/[^0-9.]/g, ''))
	}
	const formatted = amount.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	return (
		<>
			<span className="font-semibold mr-0.5">{formatted.charAt(0)}</span>
			<span>{formatted.slice(1)}</span>
		</>
	)
}

export { CurrencyFormat }
