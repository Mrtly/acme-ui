import React from 'react'
//internal helper function only - not exported by library

const JsonCodeBlockDisplay = ({ data }: { data: object }) => {
	return (
		<pre className="mt-2 w-[340px] rounded-md bg-black p-4">
			<code className="text-white block overflow-auto">{JSON.stringify(data, null, 2)}</code>
		</pre>
	)
}

export default JsonCodeBlockDisplay
