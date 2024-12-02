import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cva, type VariantProps } from 'class-variance-authority'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// Primitives: https://www.radix-ui.com/primitives/docs/components/dialog

// ------------------------------------- DrawerDialog

const DrawerDialog = DialogPrimitive.Root

// ------------------------------------- DrawerDialog Trigger

const DrawerDialogTrigger = DialogPrimitive.Trigger

// ------------------------------------- DrawerDialog Portal

const DrawerDialogPortal = DialogPrimitive.Portal

// ------------------------------------- DrawerDialog Overlay

// forwardRef because the Radix Primitive uses it (console error without it)

const DrawerDialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
	const styles = cn(
		'fixed inset-0 z-50 bg-white/80 text-gray-500 backdrop-blur-sm data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:fade-out-0 data-[state=open]:motion-safe:fade-in-0',
		className
	)

	return <DialogPrimitive.Overlay ref={ref} className={styles} {...props} />
})

DrawerDialogOverlay.displayName = 'DrawerDialogOverlay'

// ------------------------------------- DrawerDialog Variants

const DrawerDialogVariants = cva(
	'fixed z-50 gap-4 bg-white pt-6 pl-6 shadow-lg transition ease-in-out data-[state=open]:motion-safe:animate-in data-[state=closed]:motion-safe:animate-out data-[state=closed]:motion-safe:duration-300 data-[state=open]:motion-safe:duration-500',
	{
		variants: {
			side: {
				top: 'inset-x-0 top-0 border-b data-[state=closed]:motion-safe:slide-out-to-top data-[state=open]:motion-safe:slide-in-from-top',
				bottom:
					'inset-x-0 bottom-0 border-t data-[state=closed]:motion-safe:slide-out-to-bottom data-[state=open]:motion-safe:slide-in-from-bottom',
				left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:motion-safe:slide-out-to-left data-[state=open]:motion-safe:slide-in-from-left sm:max-w-sm',
				right:
					'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:motion-safe:slide-out-to-right data-[state=open]:motion-safe:slide-in-from-right sm:max-w-sm',
			},
		},
		defaultVariants: {
			side: 'right',
		},
	}
)

// ------------------------------------- DrawerDialog Content

export type DrawerDialogContentProps = Omit<DialogPrimitive.DialogContentProps, 'title'> &
	VariantProps<typeof DrawerDialogVariants> & {
		children: React.ReactNode
		showClose?: boolean
		title?: React.ReactNode //An accessible title to be announced when the dialog is opened.
		description?: React.ReactNode //An optional accessible description to be announced when the dialog is opened.
	}

const DrawerDialogContent = ({
	side = 'right',
	className,
	children,
	showClose = true,
	title,
	description,
	...props
}: DrawerDialogContentProps) => {
	const styles = cn(DrawerDialogVariants({ side }), 'flex flex-col gap-4', className)

	const scrollableContent = 'overflow-y-auto flex gap-4 flex-col pr-6'

	const descriptionTarget = !description ? { 'aria-describedby': undefined } : {} //https://www.radix-ui.com/primitives/docs/components/dialog#description

	return (
		<DrawerDialogPortal>
			<DrawerDialogOverlay>
				<DialogPrimitive.Content className={styles} {...props} {...descriptionTarget}>
					{showClose && <DrawerDialogClose />}

					{(title || description) && (
						<div className="flex flex-col gap-y-2">
							{title && <DrawerDialogTitle>{title}</DrawerDialogTitle>}
							{description && <DrawerDialogDescription>{description}</DrawerDialogDescription>}
						</div>
					)}

					<div className={scrollableContent}>{children}</div>
				</DialogPrimitive.Content>
			</DrawerDialogOverlay>
		</DrawerDialogPortal>
	)
}

// ------------------------------------- DrawerDialog Close

const DrawerDialogClose = () => {
	const closeStyles = 'absolute right-4 top-4'
	return (
		<DialogPrimitive.Close className={closeStyles}>
			<Icon name="X" />
			<span className="sr-only">Close</span>
		</DialogPrimitive.Close>
	)
}

// ------------------------------------- DrawerDialog Title

const DrawerDialogTitle = ({ className, ...props }: DialogPrimitive.DialogTitleProps) => {
	const styles = cn('text-lg font-semibold text-gray-900', className)

	return <DialogPrimitive.Title className={styles} {...props} />
}

// ------------------------------------- DrawerDialog Description

const DrawerDialogDescription = ({
	className,
	...props
}: DialogPrimitive.DialogDescriptionProps) => {
	const styles = cn('text-sm text-gray-500', className)

	return <DialogPrimitive.Description className={styles} {...props} />
}

// ------------------------------------- Drawer Dialog Footer

const DrawerDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	const styles = cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2', className)

	return <div className={styles} {...props} />
}

// ------------------------------------- DrawerDialog Exports

export {
	DrawerDialog,
	DrawerDialogTrigger,
	DrawerDialogContent,
	DrawerDialogTitle,
	DrawerDialogDescription,
	DrawerDialogClose,
	DrawerDialogFooter,
}
