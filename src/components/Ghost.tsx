import type { UseTransition } from '@app/hooks/useTransition'
import type { ComponentProps, ReactNode } from 'react'
import { useWhile } from '@app/hooks/useWhile'
import { $mouseX, $mouseY } from '@app/state/state'
import { useSignal } from '@app/utils/signals/useSignal'
import { twJoin } from 'tailwind-merge'

interface GhostProps extends ComponentProps<'div'> {
    transition: UseTransition
}

export function Ghost({
    transition,
    className,
    children,
}: GhostProps): ReactNode {
    const isDragging = transition.isOpen
    const x = useWhile(useSignal($mouseX), isDragging)
    const y = useWhile(useSignal($mouseY), isDragging)
    const content = useWhile(children, isDragging)

    return (
        <div
            className="pointer-events-none absolute left-0 top-0 flex items-center justify-center whitespace-nowrap"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div
                data-modal="tooltip"
                style={transition.style}
                className={twJoin(
                    transition.className,
                    'absolute flex h-8 -translate-y-1 items-center rounded-md bg-[--bg] px-3 text-xs font-medium text-[--fg] backdrop-blur-xl',
                    transition.isOpenedOrOpening && 'scale-100 opacity-100',
                    transition.isClosedOrClosing && 'scale-75 opacity-0',
                    className,
                )}
            >
                {content}
            </div>
        </div>
    )
}
