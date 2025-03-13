import type { ComponentProps, ReactNode } from 'react'
import { useTooltip } from '../useTooltip'
import { TooltipRoot } from './TooltipRoot'
import { TooltipTarget } from './TooltipTarget'

interface TooltipProps extends Omit<ComponentProps<'div'>, 'popover'> {
    id?: string
    delay?: number
    asChild?: boolean
    content?: string
    render?: () => ReactNode
}

export function Tooltip({
    id,
    delay,
    asChild,
    content,
    render,
    children,
    ...rest
}: TooltipProps): ReactNode {
    const tooltip = useTooltip(id)

    return (
        <>
            <TooltipTarget
                {...rest}
                tooltip={tooltip}
                delay={delay}
                asChild={asChild}
            >
                {children}
            </TooltipTarget>
            <TooltipRoot
                tooltip={tooltip}
                render={() => content ?? render?.() ?? ''}
            />
        </>
    )
}
