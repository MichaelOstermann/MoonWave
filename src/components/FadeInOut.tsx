import type { TransitionStatus } from '@app/hooks/useTransition'
import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { useTransition } from '@app/hooks/useTransition'
import { twMerge } from 'tailwind-merge'

interface FadeInOutProps extends ComponentProps<'div'> {
    show: boolean
    openStyle?: CSSProperties
    closeStyle?: CSSProperties
    animateMount?: boolean
    fadeInDuration?: number
    fadeOutDuration?: number
    fadeOutDelay?: number
    keepMounted?: boolean
    onChangeStatus?: (status: TransitionStatus) => void
}

const defaultOpenStyle = { transform: 'scale(1)', opacity: 1 }
const defaultCloseStyle = { transform: 'scale(0)', opacity: 0 }

export function FadeInOut({
    show,
    openStyle,
    closeStyle,
    animateMount = false,
    fadeInDuration,
    fadeOutDuration,
    fadeOutDelay,
    keepMounted = false,
    onChangeStatus,
    style,
    className,
    children,
    ...rest
}: FadeInOutProps): ReactNode {
    const transition = useTransition({
        isOpen: show,
        animateMount,
        openDuration: fadeInDuration ?? 500,
        closeDuration: fadeOutDuration ?? 500,
        closingDelay: fadeOutDelay,
        onChange: onChangeStatus,
    })

    if (!keepMounted && !transition.mounted) return null

    return (
        <div
            {...rest}
            className={twMerge('flex', className)}
            style={{
                ...transition.style({
                    open: openStyle ?? defaultOpenStyle,
                    close: closeStyle ?? defaultCloseStyle,
                }),
                ...style,
            }}
        >
            {children}
        </div>
    )
}
