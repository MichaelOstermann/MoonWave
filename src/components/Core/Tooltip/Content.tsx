import type { ComponentProps, ReactNode } from "react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { TooltipContext } from "./context"

interface ContentProps extends ComponentProps<"div"> {}

export function Content({
    children,
    className,
    style,
    ...rest
}: ContentProps): ReactNode {
    const { transition } = use(TooltipContext)
    const opacityTransition = transition?.style({
        close: { opacity: 0 },
        open: { opacity: 1 },
    })

    return (

        <div
            className={twMerge("content z-30 flex h-7 shrink grow items-center rounded-sm bg-(--bg) px-2 text-xs font-medium text-(--fg)", className)}
            style={{
                ...opacityTransition,
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>

    )
}
