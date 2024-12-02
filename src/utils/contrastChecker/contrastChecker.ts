// Using webAIM's color contrast checker API

const apiUrl = 'https://webaim.org/resources/contrastchecker'

export type ContrastResult = {
	ratio: string
	AA: string
	AALarge: string
	AAA: string
	AAALarge: string
}

const checkContrast = async (colorF: string, colorB: string): Promise<ContrastResult> => {
	const foregroundColor = colorF.slice(1)
	const backgroundColor = colorB.slice(1)

	const queryUrl = `${apiUrl}/?fcolor=${foregroundColor}&bcolor=${backgroundColor}&api`

	const response = await fetch(queryUrl)
	const result: ContrastResult = await response?.json()

	// console.log(result)
	return result
}

const checkContrastAAResult = (result: ContrastResult | undefined) => {
	return result?.AA === 'pass' && result?.AALarge === 'pass'
}

const checkContrastAAAResult = (result: ContrastResult | undefined) => {
	return result?.AAA === 'pass' && result?.AAALarge === 'pass'
}

export { checkContrast, checkContrastAAResult, checkContrastAAAResult }
