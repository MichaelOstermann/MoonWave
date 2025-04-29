import type { ComponentProps, ReactNode } from "react"
import { useSignal } from "@monstermann/signals-react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { PopoverContext } from "./context"

interface ContentProps extends ComponentProps<"div"> {}

export function Content({
    children,
    className,
    style,
    ...rest
}: ContentProps): ReactNode {
    const { popover, transition } = use(PopoverContext)
    const position = useSignal(() => popover?.$position())
    const opacityTransition = transition?.style({
        close: { opacity: 0 },
        open: { opacity: 1 },
    })

    return (

        <div
            className={twMerge("content z-30 flex shrink grow rounded-lg border border-(--border) bg-(--bg) text-(--fg)", className)}
            style={{
                boxShadow: "var(--shadow)",
                maxHeight: position?.maxHeight,
                ...opacityTransition,
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>

    )
}
