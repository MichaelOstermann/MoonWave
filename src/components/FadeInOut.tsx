import type { ComponentProps, ReactNode } from 'react'
import { useTransition } from '@app/hooks/useTransition'
import { twMerge } from 'tailwind-merge'

interface FadeInOutProps extends ComponentProps<'div'> {
    show: boolean
    animateInitial?: boolean
    fadeInDuration?: number
    fadeOutDuration?: number
    fadeOutDelay?: number
}

export function FadeInOut({
    show,
    animateInitial,
    fadeInDuration,
    fadeOutDuration,
    fadeOutDelay,
    className,
    children,
    ...rest
}: FadeInOutProps): ReactNode {
    const { mounted, isOpenedOrOpening, isClosedOrClosing } = useTransition({
        isOpen: show,
        animateInitial,
        openDuration: fadeInDuration ?? 300,
        closeDuration: fadeOutDuration ?? 300,
        closingDelay: fadeOutDelay ?? 0,
    })

    if (!mounted) return null

    return (
        <div
            {...rest}
            className={twMerge(
                'flex transition-[transform,opacity] duration-300',
                isOpenedOrOpening && 'scale-100 opacity-100',
                isClosedOrClosing && 'scale-0 opacity-0',
                className,
            )}
        >
            {children}
        </div>
    )
}
