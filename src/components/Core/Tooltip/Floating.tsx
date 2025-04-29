import type { ComponentProps, ReactNode } from "react"
import { useSignal } from "@monstermann/signals-react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { TooltipContext } from "./context"

interface FloatingProps extends ComponentProps<"div"> {}

export function Floating({
    children,
    className,
    style,
    ...rest
}: FloatingProps): ReactNode {
    const { tooltip, transition } = use(TooltipContext)
    const position = useSignal(() => tooltip?.$position())
    const scaleTransition = transition?.style({
        close: { transform: "scale(0.75)" },
        open: { transform: "scale(1)" },
    })

    return (
        <div
            className={twMerge("relative flex", className)}
            style={{
                ...scaleTransition,
                transformOrigin: `${position?.originX}px ${position?.originY}px`,
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>
    )
}
