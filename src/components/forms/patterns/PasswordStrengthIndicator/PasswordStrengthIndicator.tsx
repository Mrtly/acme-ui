'use client'
import React, { useMemo } from 'react'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

//based on https://www.figma.com/design/b3qTLLDEJYbrBiPcz5fgPy/CXwRI-106-Preference-Center-(Final)?node-id=3816-483078&m=dev

// ------------------------------------- PasswordStrenghIndicator Types

/**
 * @type {Object} TPasswordLevel
 * @property {string} scale - The name of password strength (e.g., 'Weak', 'Strong').
 * @property {number} level - The numerical level associated with the password strength.
 * @property {string} color - The color of the indicators associated with the password strength.
 */

type TPasswordLevel = { name: string; level: number; color: string }

/**
 * Represents the properties for the PasswordStrengthIndicator component.
 */
export type TPasswordStrengthIndicator = {
	/**
	 * The password string to evaluate the password strength.
	 */
	password: string
}

/**
 * An array of password strength levels with corresponding scales and numerical levels. The level indicates by how many password requirements have been met. This is used in unit-testing in the Story. It is not exported by the library.
 *
 * @type {TPasswordLevel}
 * @constant
 * @default
 */
export const strengthScale: TPasswordLevel[] = [
	{ name: '-', level: 0, color: 'bg-gray-300' },
	{ name: 'Weak', level: 1, color: 'bg-red' },
	{ name: 'Moderate', level: 2, color: 'bg-orange' },
	{
		name: 'Good',
		level: 3,
		color: 'bg-orange',
	},
	{ name: 'Strong', level: 4, color: 'bg-green-800' },
	{ name: 'Excellent', level: 5, color: 'bg-green-800' },
]

// ------------------------------------- PasswordStrenghIndicator

const PasswordStrengthIndicator = ({ password }: TPasswordStrengthIndicator) => {
	const isValueEmpty = !password || password?.length === 0
	const hasLowerAndUpperCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
	const hasNumber = /[0-9]/.test(password)
	const hasSpecialCharacter = /[^a-zA-Z0-9]/.test(password)
	const hasRequiredLength = password?.length >= 8
	const has12PlusLength = password?.length >= 12
	const meetsRequiredCriteria =
		hasLowerAndUpperCase && hasNumber && hasSpecialCharacter && hasRequiredLength

	function determineStrengthLevel() {
		let levelUp = 0
		if (password?.length >= 1 || hasLowerAndUpperCase) {
			levelUp++
		}
		if (hasNumber) {
			levelUp++
		}
		if (hasSpecialCharacter) {
			levelUp++
		}
		if (hasRequiredLength) {
			levelUp++
		}
		if (meetsRequiredCriteria && has12PlusLength) {
			levelUp++
		}
		return levelUp
	}

	const strengthLevel = determineStrengthLevel()

	const strengthLevels: TPasswordLevel[] = useMemo(() => strengthScale, [])

	function getIconName(isValid: boolean): 'ArrowRight' | 'Check' | 'X' {
		if (isValueEmpty) {
			return 'ArrowRight'
		}
		if (isValid) {
			return 'Check'
		}
		return 'X'
	}

	function getRuleStatus(isValid: boolean): 'Verified' | 'Missing' {
		return isValid ? 'Verified' : 'Missing'
	}

	function getInstructionsClasses(isValid: boolean) {
		return cn('flex gap-2 items-center', {
			'text-green': isValid,
			'text-red': !isValid && !isValueEmpty,
		})
	}

	function getIndicatorClasses(hasStrengthLevel: boolean) {
		return cn(`h-2 grow shrink-0 basis-0 ${strengthLevels[0].color}`, {
			[strengthLevels[strengthLevel].color]: hasStrengthLevel,
		})
	}

	return (
		<div>
			<div
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={5}
				aria-valuenow={strengthLevel}
				className="flex h-2 justify-between gap-x-0.5"
				aria-hidden={true}
			>
				<div
					data-testid="level-indicator"
					className={getIndicatorClasses(strengthLevel >= 1)}
				></div>
				<div
					data-testid="level-indicator"
					className={getIndicatorClasses(strengthLevel >= 2)}
				></div>
				<div
					data-testid="level-indicator"
					className={getIndicatorClasses(strengthLevel >= 3)}
				></div>
				<div
					data-testid="level-indicator"
					className={getIndicatorClasses(strengthLevel >= 4)}
				></div>
				<div
					data-testid="level-indicator"
					className={getIndicatorClasses(strengthLevel >= 5)}
				></div>
			</div>
			<div className="text-gray-500">
				<p className="flex gap-2" aria-live="polite">
					{`Password Strength: ${strengthLevels[strengthLevel].name}`}
				</p>
				{/* Currently only the password strength element is announced on-change via the aria-live=polite */}
				{/* to improve accessibility the missing rules should be announced as well. TODO: in the next iteration  */}
				<ul className="text-sm">
					<li className={getInstructionsClasses(hasLowerAndUpperCase)}>
						<Icon
							name={getIconName(hasLowerAndUpperCase)}
							size="sm"
							ariaLabel={getRuleStatus(hasLowerAndUpperCase)} //will consider removing the icons' aria-labels and announce the whole rule instead
						/>
						Include both lower and upper case letters
					</li>
					<li className={getInstructionsClasses(hasNumber)}>
						<Icon name={getIconName(hasNumber)} size="sm" ariaLabel={getRuleStatus(hasNumber)} />
						Include a number
					</li>
					<li className={getInstructionsClasses(hasSpecialCharacter)}>
						<Icon
							name={getIconName(hasSpecialCharacter)}
							size="sm"
							ariaLabel={getRuleStatus(hasSpecialCharacter)}
						/>
						Include a special character
					</li>
					<li className={getInstructionsClasses(hasRequiredLength)}>
						<Icon
							name={getIconName(hasRequiredLength)}
							size="sm"
							ariaLabel={getRuleStatus(hasRequiredLength)}
						/>
						Be at least 8 characters long
					</li>
				</ul>
			</div>
		</div>
	)
}
// ------------------------------------- PasswordStrenghIndicator export

export { PasswordStrengthIndicator }
