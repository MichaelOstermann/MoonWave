import type { ComponentProps, ReactNode } from "react"
import { twMerge } from "tailwind-merge"

export function Root({ className, ...rest }: ComponentProps<"div">): ReactNode {
    return (
        <div className={twMerge("w-60 flex-col py-2", className)} {...rest} />
    )
}
