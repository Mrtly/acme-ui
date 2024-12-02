'use client'
import { useEffect, useState } from 'react'

//inspiration:
//https://www.joshwcomeau.com/react/prefers-reduced-motion/
//https://observablehq.com/@werehamster/avoiding-hydration-mismatch-when-using-react-hooks#useBetterMediaQuery
//do not call window, it throws hydration errors https://nextjs.org/docs/messages/react-hydration-error#common-causes

const mediaQueryString: string = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion() {
	const [prefersReduced, setPrefersReduced] = useState<null | boolean>(null)

	useEffect(() => {
		const mediaQueryList = window.matchMedia(mediaQueryString)
		const listener = () => setPrefersReduced(mediaQueryList.matches)
		mediaQueryList.addEventListener('change', listener)
		listener()
		return () => {
			mediaQueryList.removeEventListener('change', listener)
		}
	})

	return prefersReduced
}

export { usePrefersReducedMotion }
