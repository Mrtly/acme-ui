import React from 'react'
import { cn } from '@/utils/cn'

// The datetime attribute of the time element is used translate the time into a machine-readable format
// so that browsers can offer to add date reminders through the user's calendar, and search engines can produce smarter search results.

// the time element does not make a difference for screen readers

// using JS Intl DateTimeFormat
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

// ------------------------------------- DateFormat

export type DateProps = {
	date: Date
	className?: string
	dateFormat?: 'numerical' | 'short' | 'medium' | 'long'
	timeFormat?: undefined | 'time' | 'timezone'
}

const DateFormat = ({ date, dateFormat = 'medium', timeFormat, className }: DateProps) => {
	const styles = cn(className)

	const baseOptions: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		day: 'numeric',
	}

	const numericOptions: Intl.DateTimeFormatOptions = {
		...baseOptions,
		month: 'numeric',
	}

	const shortOptions: Intl.DateTimeFormatOptions = {
		...baseOptions,
		month: 'short',
	}

	const mediumOptions: Intl.DateTimeFormatOptions = {
		...baseOptions,
		month: 'long',
	}

	const longOptions: Intl.DateTimeFormatOptions = {
		...mediumOptions,
		weekday: 'long',
	}

	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: 'numeric',
		minute: 'numeric',
	}

	const zoneOptions: Intl.DateTimeFormatOptions = {
		...timeOptions,
		timeZoneName: 'short',
	}

	const withTimeOptions =
		timeFormat === 'time' ? timeOptions : timeFormat === 'timezone' ? zoneOptions : null

	const optionsForDisplay =
		dateFormat === 'numerical'
			? numericOptions
			: dateFormat === 'short'
				? shortOptions
				: dateFormat === 'medium'
					? mediumOptions
					: dateFormat === 'long'
						? longOptions
						: null

	const dateAndTimeOptions: Intl.DateTimeFormatOptions = {
		...optionsForDisplay,
		...withTimeOptions,
	}

	const dateToDisplay = new Intl.DateTimeFormat(
		'en-US', // US format mm/dd/yyyy
		dateAndTimeOptions
	).format(date)

	// --------------- the below is for constructing the dateTime attribute value
	//https://www.w3schools.com/tags/att_time_datetime.asp

	// Format date part
	const datePart = new Intl.DateTimeFormat('fr-CA', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date) // fr-CA because dateTime attr expects YYYY-MM-DD

	// Format time part (without seconds)
	const timeFormatter = new Intl.DateTimeFormat('fr-CA', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // 24-hour format
	})

	const timeParts = timeFormatter.formatToParts(date)

	// Find hour and minute parts
	const hourPart = timeParts.find((part) => part.type === 'hour')
	const minutePart = timeParts.find((part) => part.type === 'minute')

	if (!hourPart || !minutePart) {
		throw new Error('Failed to format time parts')
	}

	const timePart = `${hourPart.value}:${minutePart.value}`

	// Get the timezone offset in minutes and convert it to hours and minutes
	const timezoneOffset = date.getTimezoneOffset()
	const offsetHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0')
	const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0')
	const offsetSign = timezoneOffset > 0 ? '-' : '+'
	const timezonePart = `${offsetSign}${offsetHours}:${offsetMinutes}`

	// Combine date and time parts (only add time/timezone if added via the prop)
	const dateTime =
		timeFormat === 'timezone'
			? `${datePart} ${timePart}${timezonePart}`
			: timeFormat === 'time'
				? `${datePart} ${timePart}`
				: datePart

	return (
		//The datetime attribute represents a machine-readable format of a <time> element.
		<time className={styles} dateTime={dateTime}>
			{dateToDisplay}
		</time>
	)
}

// ------------------------------------- DateFormat Export

export { DateFormat }
