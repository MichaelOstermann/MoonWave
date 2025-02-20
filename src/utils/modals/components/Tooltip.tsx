import type { ComponentProps, ReactNode } from 'react'
import type { Tooltip as TooltipT } from '../types'
import { TooltipRoot } from './TooltipRoot'
import { TooltipTarget } from './TooltipTarget'

interface TooltipProps extends Omit<ComponentProps<'div'>, 'popover'> {
    tooltip: TooltipT
    delay?: number
    asChild?: boolean
    render: () => ReactNode
}

export function Tooltip({
    tooltip,
    delay,
    asChild,
    render,
    children,
}: TooltipProps): ReactNode {
    return (
        <>
            <TooltipTarget
                tooltip={tooltip}
                delay={delay}
                asChild={asChild}
            >
                {children}
            </TooltipTarget>
            <TooltipRoot
                tooltip={tooltip}
                render={render}
            />
        </>
    )
}
