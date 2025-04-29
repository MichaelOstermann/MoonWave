import type { ComponentProps, ReactNode } from "react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { DialogContext } from "./context"

export interface FloatingProps extends ComponentProps<"div"> {}

export function Floating({
    className,
    style,
    ...rest
}: FloatingProps): ReactNode {
    const { dialog, transition } = use(DialogContext)
    const scaleTransition = transition?.style({
        close: { transform: "scale(0.95)" },
        open: { transform: "scale(1)" },
    })

    return (
        <div
            className={twMerge("relative z-10 flex", className)}
            ref={el => dialog?.$floatingElement(el)}
            style={{ ...scaleTransition, ...style }}
            {...rest}
        />
    )
}
