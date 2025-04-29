import type { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function Left({ className, ...rest }: ComponentProps<"div">): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge(
                "pointer-events-none absolute left-0 flex items-center justify-center",
                className,
            )}
        />
    )
}
