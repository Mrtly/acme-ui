import type { PrismTheme } from 'prism-react-renderer'
import { twColors } from '@/utils/colors'

const theme: PrismTheme = {
	plain: {
		color: '#9CDCFE',
		backgroundColor: twColors.gray[900],
	},
	styles: [
		{
			types: ['prolog'],
			style: {
				color: 'rgb(0, 0, 128)',
			},
		},
		{
			types: ['comment'],
			style: {
				color: 'rgb(106, 153, 85)',
			},
		},
		{
			types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
			style: {
				color: 'rgb(86, 156, 214)',
			},
		},
		{
			types: ['number', 'inserted'],
			style: {
				color: 'rgb(181, 206, 168)',
			},
		},
		{
			types: ['constant'],
			style: {
				color: 'rgb(100, 102, 149)',
			},
		},
		{
			types: ['attr-name', 'variable'],
			style: {
				color: 'rgb(156, 220, 254)',
			},
		},
		{
			types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
			style: {
				color: 'rgb(206, 145, 120)',
			},
		},
		{
			types: ['selector'],
			style: {
				color: 'rgb(215, 186, 125)',
			},
		},
		{
			// Fix tag color
			types: ['tag'],
			style: {
				color: 'rgb(78, 201, 176)',
			},
		},
		{
			// Fix tag color for HTML
			types: ['tag'],
			languages: ['markup'],
			style: {
				color: 'rgb(86, 156, 214)',
			},
		},
		{
			types: ['punctuation', 'operator'],
			style: {
				color: 'rgb(212, 212, 212)',
			},
		},
		{
			// Fix punctuation color for HTML
			types: ['punctuation'],
			languages: ['markup'],
			style: {
				color: '#808080',
			},
		},
		{
			types: ['function'],
			style: {
				color: 'rgb(220, 220, 170)',
			},
		},
		{
			types: ['class-name'],
			style: {
				color: 'rgb(78, 201, 176)',
			},
		},
		{
			types: ['char'],
			style: {
				color: 'rgb(209, 105, 105)',
			},
		},
	],
}
export default theme
