import type { ComponentProps, ReactNode } from 'react'
import type { Popover } from '../types'
import { Slot } from '@radix-ui/react-slot'
import { twMerge } from 'tailwind-merge'

interface PopoverTargetProps extends Omit<ComponentProps<'div'>, 'popover'> {
    popover: Popover
    asChild?: boolean
}

export function PopoverTarget({
    popover,
    asChild,
    className,
    ...rest
}: PopoverTargetProps): ReactNode {
    const Comp = asChild ? Slot : 'div'

    return (
        <Comp
            {...rest}
            ref={el => void popover.anchorElement.set(el)}
            className={twMerge('popover-target', className)}
        />
    )
}
