export const createMockDataTransferEvent = (
	eventType: string,
	files: File[],
	effectAllowed: string = 'all'
) => {
	const dataTransferObject = {
		dataTransfer: {
			files,
			items: files.map((file) => ({
				kind: 'file',
				type: file.type,
				getAsFile: () => file,
			})),
			types: ['Files'],
			effectAllowed,
		},
	}
	const event = new Event(eventType, { bubbles: true })
	Object.assign(event, dataTransferObject)
	return event
}
