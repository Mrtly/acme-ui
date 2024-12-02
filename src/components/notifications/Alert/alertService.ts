'use client'
import React, { useState, useCallback } from 'react'
import { AlertVariants } from '.'

type DynamicAlertProps = {
	id?: string
	content: string | React.ReactNode
	variant: AlertVariants
	isDismissible?: boolean
	onDismissAction?: () => void
	action?: {
		label: string
		onClick: () => void
	}
	link?: {
		label: string
		href: string
	}
}

let serviceId = -1 // Start at -1 so first alert id is 0

const alerts: DynamicAlertProps[] = []

export const useAlertService = () => {
	const [, setUpdate] = useState({}) // To trigger a re-render when the state updates

	const addAlert = useCallback(
		({
			id,
			content,
			variant = 'neutral',
			isDismissible,
			onDismissAction,
			action,
			link,
		}: DynamicAlertProps) => {
			// Check if an alert with the given id already exists
			const existingAlert = alerts.find((alert) => alert.id === id)
			if (existingAlert) {
				// If an alert with the same id exists, do not add a new alert
				return
			}

			// Increment the serviceId
			serviceId += 1

			// Create the new alert
			const newAlert: DynamicAlertProps = {
				id: id ? id : serviceId.toString(),
				content,
				variant,
				isDismissible: isDismissible !== undefined ? isDismissible : true, //defaults to true
				onDismissAction: onDismissAction,
				action,
				link,
			}

			// Add the new alert to the top of the alerts array
			alerts.unshift(newAlert)

			// Trigger a re-render to update components displaying alerts
			setUpdate({})
		},
		[]
	)

	const dismissAlert = useCallback((id: string) => {
		const index = alerts.findIndex((alert) => alert.id === id)
		if (index !== -1) {
			alerts.splice(index, 1)
			setUpdate({}) // Trigger a re-render to update components displaying alerts
		}
	}, [])

	const clearAlerts = useCallback(() => {
		alerts.splice(0)
		serviceId = -1
		setUpdate({}) // Trigger a re-render to update components displaying alerts
	}, [])

	return { alerts, addAlert, dismissAlert, clearAlerts }
}
