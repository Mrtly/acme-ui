import React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '@/utils/cn'
import buttonVariants from '@/components/buttons/Button/buttonVariants'

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = ({ ...props }: AlertDialogPrimitive.AlertDialogPortalProps) => {
	return <AlertDialogPrimitive.Portal {...props} />
}
AlertDialogPortal.displayName = AlertDialogPrimitive.Portal.displayName

// forwardRef because the Radix Primitive uses it (console error without it)

const AlertDialogOverlay = React.forwardRef<
	React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
	const styles = cn(
		'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 border-r-8 border-black',
		className
	)

	return <AlertDialogPrimitive.Overlay ref={ref} className={styles} {...props} />
})
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = ({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogContentProps) => {
	const styles = cn(
		'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-gray-200 text-gray-500 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
		'overflow-y-auto max-h-[90vh]', //creates scrollable area
		className
	)
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content className={styles} {...props} />
		</AlertDialogPortal>
	)
}

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const styles = cn('flex flex-col gap-y-2 text-center sm:text-left', className)

	return <div className={styles} {...props} />
}

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const styles = cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2', className)

	return <div className={styles} {...props} />
}

const AlertDialogTitle = ({ className, ...props }: AlertDialogPrimitive.AlertDialogTitleProps) => {
	const styles = cn('text-lg font-semibold', className)

	return <AlertDialogPrimitive.Title className={styles} {...props} />
}

const AlertDialogDescription = ({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogDescriptionProps) => {
	const styles = cn('text-sm text-gray-500', className)
	return <AlertDialogPrimitive.Description className={styles} {...props} />
}

const AlertDialogAction = ({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogActionProps) => {
	const styles = cn(buttonVariants(), className)

	return <AlertDialogPrimitive.Action className={styles} {...props} />
}

const AlertDialogCancel = ({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogCancelProps) => {
	const styles = cn(buttonVariants({ variant: 'secondary' }), 'mt-2 sm:mt-0', className)

	return <AlertDialogPrimitive.Cancel className={styles} {...props} />
}

export {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
}
