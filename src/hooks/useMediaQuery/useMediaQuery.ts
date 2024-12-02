import React from 'react'

type UseMediaQueryOptions = {
	getInitialValueInEffect: boolean
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Older versions of Safari (shipped with Catalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */

function attachMediaListener(query: MediaQueryList, callback: MediaQueryCallback) {
	try {
		query.addEventListener('change', callback)
		return () => query.removeEventListener('change', callback)
		//eslint-disable-next-line
	} catch (e) {
		query.addListener(callback)
		return () => query.removeListener(callback)
	}
}

function getInitialValue(query: string, initialValue?: boolean) {
	if (typeof initialValue === 'boolean') {
		return initialValue
	}

	if (typeof window !== 'undefined' && 'matchMedia' in window) {
		return window?.matchMedia(query).matches
	}

	return false
}

function useMediaQuery(
	query: string,
	initialValue?: boolean,
	{ getInitialValueInEffect }: UseMediaQueryOptions = {
		getInitialValueInEffect: true,
	}
) {
	const [matches, setMatches] = React.useState(
		getInitialValueInEffect ? false : getInitialValue(query, initialValue)
	)
	const queryRef = React.useRef<MediaQueryList>()

	React.useEffect(() => {
		if ('matchMedia' in window) {
			queryRef.current = window?.matchMedia(query)
			setMatches(queryRef.current.matches)
			return attachMediaListener(queryRef.current, (event) => setMatches(event.matches))
		}

		return undefined
	}, [query])

	return matches
}

export { useMediaQuery }