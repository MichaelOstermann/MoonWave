import type { ComponentProps, ReactNode } from 'react'
import type { Popover } from '../types'
import { useSignal } from '@app/utils/signals/useSignal'
import { Slot } from '@radix-ui/react-slot'

interface PopoverTargetProps extends Omit<ComponentProps<'div'>, 'popover'> {
    popover: Popover
    asChild?: boolean
}

export function PopoverTarget({
    popover,
    asChild,
    ...rest
}: PopoverTargetProps): ReactNode {
    const Comp = asChild ? Slot : 'div'
    const status = useSignal(popover.status)

    return (
        <Comp
            {...rest}
            ref={el => void popover.anchorElement.set(el)}
            data-modal-target="popover"
            data-modal-status={status}
        />
    )
}
