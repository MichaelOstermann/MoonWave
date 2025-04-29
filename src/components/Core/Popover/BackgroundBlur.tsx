import type { ReactNode } from "react"
import { use } from "react"
import { PopoverContext } from "./context"

export function BackgroundBlur(): ReactNode {
    const { transition } = use(PopoverContext)
    const opacityTransition = transition?.style({
        close: { opacity: 0 },
        open: { opacity: 1 },
    })

    return (
        <div className="absolute z-20 flex size-full items-center justify-center overflow-hidden rounded-lg">
            <div
                className="absolute backdrop-blur-sm"
                style={{
                    "--tw-backdrop-blur": "blur(var(--blur))",
                    "height": "calc(100% + 50px)",
                    "width": "calc(100% + 50px)",
                    ...opacityTransition,
                }}
            />
            <div
                className="absolute backdrop-blur-sm"
                style={{
                    "--tw-backdrop-blur": "blur(var(--blur))",
                    "height": "calc(100% + 50px)",
                    "width": "calc(100% + 50px)",
                    ...opacityTransition,
                }}
            />
        </div>
    )
}
