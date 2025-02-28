import type { ComponentProps, ReactNode } from 'react'
import { glide } from '@app/config/easings'
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
    style,
    className,
    children,
    ...rest
}: FadeInOutProps): ReactNode {
    const transition = useTransition({
        isOpen: show,
        easing: glide,
        animateInitial,
        openDuration: fadeInDuration ?? 500,
        closeDuration: fadeOutDuration ?? 500,
        openClassName: 'scale-100',
        closeClassName: 'scale-0',
        closingDelay: fadeOutDelay ?? 0,
    })

    if (!transition.mounted) return null

    return (
        <div
            {...rest}
            style={{ ...transition.style, ...style }}
            className={twMerge('flex', transition.className, className)}
        >
            {children}
        </div>
    )
}
