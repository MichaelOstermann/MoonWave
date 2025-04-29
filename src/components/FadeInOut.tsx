import type { TransitionStatus } from "#hooks/useTransition"
import type { ComponentProps, CSSProperties, ReactNode } from "react"
import { useTransition } from "#hooks/useTransition"
import { twMerge } from "tailwind-merge"

interface FadeInOutProps extends ComponentProps<"div"> {
    animateMount?: boolean
    closeStyle?: CSSProperties
    fadeInDuration?: number
    fadeOutDelay?: number
    fadeOutDuration?: number
    keepMounted?: boolean
    openStyle?: CSSProperties
    show: boolean
    onChangeStatus?: (status: TransitionStatus) => void
}

const defaultOpenStyle = { opacity: 1, transform: "scale(1)" }
const defaultCloseStyle = { opacity: 0, transform: "scale(0)" }

export function FadeInOut({
    animateMount = false,
    children,
    className,
    closeStyle,
    fadeInDuration,
    fadeOutDelay,
    fadeOutDuration,
    keepMounted = false,
    onChangeStatus,
    openStyle,
    show,
    style,
    ...rest
}: FadeInOutProps): ReactNode {
    const transition = useTransition({
        animateMount,
        closeDuration: fadeOutDuration ?? 300,
        closingDelay: fadeOutDelay,
        isOpen: show,
        onChange: onChangeStatus,
        openDuration: fadeInDuration ?? 300,
    })

    if (!keepMounted && !transition.mounted) return null

    return (
        <div
            {...rest}
            className={twMerge("flex", className)}
            style={{
                ...transition.style({
                    close: closeStyle ?? defaultCloseStyle,
                    open: openStyle ?? defaultOpenStyle,
                }),
                ...style,
            }}
        >
            {children}
        </div>
    )
}
