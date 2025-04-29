import type { Dialog } from "#src/features/Modals"
import type { ComponentProps, ReactNode } from "react"
import { useTransition } from "#hooks/useTransition"
import { useSignal } from "@monstermann/signals-react"
import { Portal } from "@radix-ui/react-portal"
import { useUnmountEffect } from "@react-hookz/web"
import { twMerge } from "tailwind-merge"
import { DialogContext } from "./context"

export interface RootProps extends ComponentProps<"div"> {
    dialog: Dialog
}

export function Root({
    children,
    className,
    dialog,
    ...rest
}: RootProps): ReactNode {
    const isOpen = useSignal(() => dialog.$isOpen())
    const transition = useTransition({
        closeDuration: 200,
        isOpen,
        openDuration: 250,
        onChange: status => dialog.$status(status),
    })
    useUnmountEffect(() => dialog.$status("closed"))

    if (!transition.mounted) return null

    return (
        <Portal asChild>
            <div
                {...rest}
                className={twMerge(
                    "modal dialog fixed inset-0 flex items-center justify-center",
                    transition.status,
                    className,
                )}
            >
                <DialogContext value={{ dialog, transition }}>
                    {children}
                </DialogContext>
            </div>
        </Portal>
    )
}
