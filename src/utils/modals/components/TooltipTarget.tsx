import type { Tooltip } from '../types'
import { useSignal } from '@app/utils/signals/useSignal'
import { Slot } from '@radix-ui/react-slot'
import { useUnmountEffect } from '@react-hookz/web'
import { type ComponentProps, type ReactNode, useRef } from 'react'

interface TooltipTargetProps extends Omit<ComponentProps<'div'>, 'popover'> {
    tooltip: Tooltip
    delay?: number
    asChild?: boolean
}

export function TooltipTarget({
    tooltip,
    delay = 600,
    asChild,
    ...rest
}: TooltipTargetProps): ReactNode {
    const Comp = asChild ? Slot : 'div'
    const status = useSignal(tooltip.status)
    const timerRef = useRef<Timer>(undefined)

    useUnmountEffect(() => clearTimeout(timerRef.current))

    return (
        <Comp
            {...rest}
            ref={el => void tooltip.anchorElement.set(el)}
            data-modal-target="tooltip"
            data-modal-status={status}
            onMouseDown={() => clearTimeout(timerRef.current)}
            onMouseMove={() => {
                clearTimeout(timerRef.current)
                timerRef.current = setTimeout(tooltip.open, delay)
            }}
            onMouseLeave={() => {
                clearTimeout(timerRef.current)
                tooltip.close()
            }}
        />
    )
}
