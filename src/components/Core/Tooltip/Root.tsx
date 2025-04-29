import type { Tooltip } from "#src/features/Modals"
import type { ComponentProps, ReactNode } from "react"
import { useTransition } from "#hooks/useTransition"
import { useSignal } from "@monstermann/signals-react"
import { Portal } from "@radix-ui/react-portal"
import { useUnmountEffect } from "@react-hookz/web"
import { twMerge } from "tailwind-merge"
import { TooltipContext } from "./context"

interface RootProps extends ComponentProps<"div"> {
    tooltip: Tooltip | undefined
}

export function Root({
    children,
    className,
    style,
    tooltip,
    ...rest
}: RootProps): ReactNode {
    const isOpen = useSignal(() => tooltip?.$isOpen() ?? false)
    const position = useSignal(() => tooltip?.$position())
    const transition = useTransition({
        closeDuration: 200,
        isOpen,
        openDuration: 200,
        onChange: status => tooltip?.$status(status),
    })
    useUnmountEffect(() => tooltip?.$status("closed"))

    if (!transition.mounted) return null

    return (
        <Portal asChild>
            <div
                className={twMerge("modal tooltip fixed flex", transition.status, className)}
                onClick={evt => evt.stopPropagation()}
                onContextMenu={evt => evt.stopPropagation()}
                onPointerDown={evt => evt.stopPropagation()}
                ref={el => tooltip?.$floatingElement(el)}
                style={{ transform: `translate(${position?.floatingX}px, ${position?.floatingY}px)`, ...style }}
                {...rest}
            >
                <TooltipContext value={{ tooltip, transition }}>
                    {children}
                </TooltipContext>
            </div>
        </Portal>
    )
}
