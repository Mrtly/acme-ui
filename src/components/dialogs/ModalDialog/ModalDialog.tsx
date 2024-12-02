import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

const ModalDialog = DialogPrimitive.Root

const ModalDialogTrigger = DialogPrimitive.Trigger

const ModalDialogPortal = ({ ...props }: DialogPrimitive.DialogPortalProps) => {
	return <DialogPrimitive.Portal {...props} />
}
ModalDialogPortal.displayName = 'ModalDialogPortal'

// forwardRef because the Radix Primitive uses it (console error without it)

const ModalDialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
	const styles = cn(
		'fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		className
	)

	return <DialogPrimitive.Overlay ref={ref} className={styles} {...props} />
})
ModalDialogOverlay.displayName = 'ModalDialogOverlay'

type ModalDialogContentProps = DialogPrimitive.DialogContentProps & {
	showCloseButton?: boolean
}
const ModalDialogContent = ({
	className,
	children,
	showCloseButton = true,
	...props
}: ModalDialogContentProps) => {
	const contentStyles = cn(
		'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-gray-200 bg-white text-gray-500 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
		'overflow-y-auto max-h-[90vh]', //creates scrollable area
		className
	)

	const closeStyles = cn(
		'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 data-[state=open]:text-gray-500'
	)

	return (
		<ModalDialogPortal>
			<ModalDialogOverlay />
			<DialogPrimitive.Content className={contentStyles} {...props}>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close className={closeStyles}>
						<Icon name="X" />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</ModalDialogPortal>
	)
}

const ModalDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const styles = cn('flex flex-col gap-y-1.5 text-center sm:text-left', className)

	return <div className={styles} {...props} />
}
ModalDialogHeader.displayName = 'ModalDialogHeader'

const ModalDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const styles = cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2', className)

	return <div className={styles} {...props} />
}
ModalDialogFooter.displayName = 'ModalDialogFooter'

const ModalDialogTitle = ({ className, ...props }: DialogPrimitive.DialogTitleProps) => {
	const styles = cn('text-lg font-semibold leading-none tracking-tight', className)

	return <DialogPrimitive.Title className={styles} {...props} />
}

const ModalDialogDescription = ({
	className,
	...props
}: DialogPrimitive.DialogDescriptionProps) => {
	const styles = cn('text-sm text-gray-500', className)

	return <DialogPrimitive.Description className={styles} {...props} />
}

const ModalDialogClose = DialogPrimitive.Close

export {
	ModalDialog,
	ModalDialogTrigger,
	ModalDialogContent,
	ModalDialogHeader,
	ModalDialogFooter,
	ModalDialogTitle,
	ModalDialogDescription,
	ModalDialogClose,
}
