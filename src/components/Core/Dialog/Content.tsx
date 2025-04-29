import type { ComponentProps, ReactNode } from "react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { DialogContext } from "./context"

export interface ContentProps extends ComponentProps<"div"> {}

export function Content({
    className,
    style,
    ...rest
}: ContentProps): ReactNode {
    const { transition } = use(DialogContext)
    const opacityTransition = transition?.style({
        close: { opacity: 0 },
        open: { opacity: 1 },
    })

    return (
        <div
            className={twMerge("z-30 flex shrink grow rounded-lg border border-(--border) bg-(--bg) text-sm text-(--fg)", className)}
            style={{
                ...opacityTransition,
                boxShadow: "var(--shadow)",
                ...style,
            }}
            {...rest}
        />
    )
}
