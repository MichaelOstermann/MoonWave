import type { Popover } from "#src/features/Modals"
import type { ComponentProps, ReactNode } from "react"
import { useTransition } from "#hooks/useTransition"
import { useSignal } from "@monstermann/signals-react"
import { Portal } from "@radix-ui/react-portal"
import { useUnmountEffect } from "@react-hookz/web"
import { twJoin } from "tailwind-merge"
import { PopoverContext } from "./context"

interface RootProps extends Omit<ComponentProps<"div">, "popover"> {
    popover: Pick<Popover, "$status" | "$position" | "$floatingElement" | "$isOpen"> | undefined
}

export function Root({
    children,
    className,
    popover,
    style,
    ...rest
}: RootProps): ReactNode {
    const isOpen = useSignal(() => popover?.$isOpen() ?? false)
    const position = useSignal(() => popover?.$position())
    const transition = useTransition({
        closeDuration: 200,
        isOpen,
        openDuration: 250,
        onChange: status => popover?.$status(status),
    })
    useUnmountEffect(() => popover?.$status("closed"))

    if (!transition.mounted) return null

    return (
        <Portal asChild>
            <div
                className={twJoin("modal popover fixed flex", transition.status, className)}
                onClick={evt => evt.stopPropagation()}
                onContextMenu={evt => evt.stopPropagation()}
                onPointerDown={evt => evt.stopPropagation()}
                ref={el => popover?.$floatingElement(el)}
                style={{ transform: `translate(${position?.floatingX}px, ${position?.floatingY}px)`, ...style }}
                {...rest}
            >
                <PopoverContext value={{ popover, transition }}>
                    {children}
                </PopoverContext>
            </div>
        </Portal>
    )
}
