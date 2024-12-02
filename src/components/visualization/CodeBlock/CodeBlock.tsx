'use client'
import React, { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

export type BlockProps = {
	code: string
	darkMode?: boolean
	className?: string
	lang?: string
	filename?: string
	showCopyButton?: boolean
}

const CodeBlock = ({
	code,
	className,
	lang = 'tsx',
	filename,
	darkMode = true,
	showCopyButton = true,
}: BlockProps) => {
	return (
		<div className={cn('relative')}>
			{filename && (
				<div
					className={cn(
						'rounded-t-md p-2 pl-4 text-sm font-light tracking-wide',
						darkMode
							? 'bg-[#1e1e1e] text-[#9cdcfe] border-b border-b-gray-500'
							: 'border border-b-0 text-gray-500'
					)}
				>
					{filename}
				</div>
			)}
			<Highlight theme={darkMode ? themes.vsDark : themes.vsLight} code={code} language={lang}>
				{({ style, tokens, getLineProps, getTokenProps }) => (
					<pre
						style={style}
						className={cn(
							'rounded-b-md',
							!filename && 'rounded-t-md',
							'text-sm p-4',
							!darkMode && 'border',
							className
						)}
					>
						{tokens.map((line, i) => (
							<div key={i} {...getLineProps({ line })} style={{ textWrap: 'wrap' }}>
								{line.map((token, key) => (
									<span key={key} {...getTokenProps({ token })} />
								))}
							</div>
						))}
						{showCopyButton && (
							<CodeCopyButton copy={code} className="absolute top-1 right-2" darkMode={darkMode} />
						)}
					</pre>
				)}
			</Highlight>
		</div>
	)
}

async function copyToClipboard(text: string) {
	if ('clipboard' in navigator) {
		return await navigator.clipboard.writeText(text)
	} else {
		return document.execCommand('copy', true, text) // old browser compatibility
	}
}

const CodeCopyButton = ({
	copy,
	className,
	darkMode,
}: {
	copy: string
	className: string
	darkMode?: boolean
}) => {
	const [showCopied, setShowCopied] = useState(false)
	const handleCopyClick = () => {
		copyToClipboard(copy)
			.then(() => {
				setShowCopied(true)
				setTimeout(() => {
					setShowCopied(false)
				}, 1500)
			})
			.catch((err) => {
				console.log(err)
			})
	}
	const buttonStyles = cn(
		'ml-auto text-lg rounded p-1.5',
		darkMode
			? 'bg-[#1e1e1e] hover:bg-gray-700' // #1e1e1e is the dark from the dark theme
			: 'text-gray-500 hover:bg-gray-100',
		className
	)

	return (
		<button aria-label="copy" className={buttonStyles} onClick={handleCopyClick}>
			{showCopied ? <Icon name="CheckSquare" /> : <Icon name="Copy" />}
		</button>
	)
}

export { CodeBlock }
