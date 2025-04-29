import type { ComponentProps, ReactNode } from "react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { DialogContext } from "./context"

export interface OverlayProps extends ComponentProps<"div"> {}

export function Overlay({
    className,
    style,
    ...rest
}: OverlayProps): ReactNode {
    const { transition } = use(DialogContext)
    const opacityTransition = transition?.style({
        close: { opacity: 0 },
        open: { opacity: 1 },
    })
    return (
        <div
            className={twMerge("absolute inset-0 z-0 bg-(--overlay)", className)}
            style={{ ...opacityTransition, ...style }}
            {...rest}
        />
    )
}
