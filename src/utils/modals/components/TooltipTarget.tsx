import type { Tooltip } from '../types'
import { Slot } from '@radix-ui/react-slot'
import { useUnmountEffect } from '@react-hookz/web'
import { type ComponentProps, type ReactNode, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface TooltipTargetProps extends Omit<ComponentProps<'div'>, 'popover'> {
    tooltip: Tooltip
    delay?: number
    asChild?: boolean
}

export function TooltipTarget({
    tooltip,
    delay = 600,
    asChild,
    className,
    ...rest
}: TooltipTargetProps): ReactNode {
    const Comp = asChild ? Slot : 'div'
    const timerRef = useRef<Timer>(undefined)

    useUnmountEffect(() => clearTimeout(timerRef.current))

    return (
        <Comp
            {...rest}
            ref={tooltip.anchorElement.set}
            className={twMerge('tooltip-target', className)}
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
