import React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { Icon } from '@/theme/Icons'
import { cn } from '@/utils/cn'

// https://www.radix-ui.com/primitives/docs/components/accordion

// ------------------------------------- Accordion

type AccordionProps = Omit<
	AccordionPrimitive.AccordionSingleProps,
	'orientation' //remove orientation, style not currently supported
>

const Accordion = ({ ...props }: AccordionProps) => {
	return <AccordionPrimitive.Root {...props} />
}

// ------------------------------------- Accordion Item

const AccordionItem = ({ className, ...props }: AccordionPrimitive.AccordionItemProps) => {
	const styles = cn(['border-b', className])

	return <AccordionPrimitive.Item className={styles} {...props} />
}

// ------------------------------------- Accordion Trigger

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
	const triggerStyles = cn([
		'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
		className,
	])

	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger ref={ref} className={triggerStyles} {...props}>
				{children}
				<Icon name="ChevronDown" size="sm" className="transition-transform duration-200" />
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	)
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

// ------------------------------------- Accordion Content

const AccordionContent = ({
	className,
	children,
	...props
}: AccordionPrimitive.AccordionContentProps) => {
	const styles = cn([
		'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
		className,
	])

	return (
		<AccordionPrimitive.Content className={styles} {...props}>
			<div className="pb-4 pt-0">{children}</div>
		</AccordionPrimitive.Content>
	)
}

// ------------------------------------- Accordion Exports

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
