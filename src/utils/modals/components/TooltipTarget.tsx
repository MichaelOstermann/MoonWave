import type { Tooltip } from '../types'
import { useSignal } from '@app/utils/signals/useSignal'
import { Slot } from '@radix-ui/react-slot'
import { type ComponentProps, type ReactNode, useEffect, useState } from 'react'

interface TooltipTargetProps extends Omit<ComponentProps<'div'>, 'popover'> {
    tooltip: Tooltip
    delay?: number
    asChild?: boolean
}

export function TooltipTarget({
    tooltip,
    delay = 800,
    asChild,
    ...rest
}: TooltipTargetProps): ReactNode {
    const Comp = asChild ? Slot : 'div'
    const status = useSignal(tooltip.status)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (!isHovered) return tooltip.close()
        const tid = setTimeout(tooltip.open, delay)
        return () => clearTimeout(tid)
    }, [tooltip, isHovered, delay])

    return (
        <Comp
            {...rest}
            ref={el => void tooltip.anchorElement.set(el)}
            data-modal-target="tooltip"
            data-modal-status={status}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        />
    )
}
