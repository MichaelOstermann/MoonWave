import type { UseTransition } from '@app/hooks/useTransition'
import type { ComponentProps, ReactNode } from 'react'
import { useWhile } from '@app/hooks/useWhile'
import { $mouseX, $mouseY, useSignal } from '@monstermann/signals'
import { twMerge } from 'tailwind-merge'

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
            className="modal tooltip pointer-events-none absolute left-0 top-0 flex items-center justify-center whitespace-nowrap"
            style={{ transform: `translate(${x}px, ${y}px)` }}
        >
            <div
                style={transition.style({
                    open: { opacity: 1, transform: 'scale(1)' },
                    close: { opacity: 0, transform: 'scale(0.75)' },
                })}
                className={twMerge(
                    'floating absolute flex h-8 -translate-y-1 items-center rounded-md bg-[--bg] px-3 text-xs font-medium text-[--fg] backdrop-blur-xl',
                    className,
                )}
            >
                {content}
            </div>
        </div>
    )
}
