import type { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function Section({ className, ...rest }: ComponentProps<"div">): ReactNode {
    return (
        <div
            {...rest}
            className={twMerge("flex flex-col", className)}
        />
    )
}
