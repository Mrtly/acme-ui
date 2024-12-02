'use client'
import React, { useEffect } from 'react'

const useOutsideClick = <T extends HTMLElement>(
	ref: React.RefObject<T>,
	onInteractOutside: () => void
): void => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onInteractOutside()
			}
		}

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onInteractOutside()
			}
		}

		const handleFocusOutside = (event: FocusEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onInteractOutside()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		document.addEventListener('keydown', handleEscapeKey)
		document.addEventListener('focusin', handleFocusOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
			document.removeEventListener('keydown', handleEscapeKey)
			document.removeEventListener('focusin', handleFocusOutside)
		}
	}, [ref, onInteractOutside])
}

export { useOutsideClick }
