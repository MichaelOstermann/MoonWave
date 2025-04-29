import type { Tooltip } from "#src/features/Modals"
import type { ComponentProps, ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"
import { useUnmountEffect } from "@react-hookz/web"
import { useRef } from "react"
import { twMerge } from "tailwind-merge"

interface TargetProps extends ComponentProps<"div"> {
    asChild?: boolean
    delay?: number
    tooltip: Tooltip | undefined
}

export function Target({
    asChild,
    className,
    delay = 600,
    tooltip,
    ...rest
}: TargetProps): ReactNode {
    const Comp = asChild ? Slot : "div"
    const timerRef = useRef<Timer>(undefined)
    useUnmountEffect(() => clearTimeout(timerRef.current))

    return (
        <Comp
            {...rest}
            className={twMerge("tooltip-target", className)}
            onMouseDown={() => clearTimeout(timerRef.current)}
            ref={el => tooltip?.$anchorElement(el)}
            onMouseLeave={() => {
                clearTimeout(timerRef.current)
                tooltip?.close()
            }}
            onMouseMove={() => {
                clearTimeout(timerRef.current)
                timerRef.current = setTimeout(() => tooltip?.open(), delay)
            }}
        />
    )
}
