import type { ComponentProps, ReactNode } from "react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { InputContext } from "./contexts"

interface FieldProps extends ComponentProps<"input"> {}

export function Field({ className, ...rest }: FieldProps): ReactNode {
    const { props } = use(InputContext)

    return (
        <input
            type="text"
            {...props}
            {...rest}
            className={twMerge(
                "flex shrink grow truncate border-none bg-transparent text-sm outline-hidden placeholder:text-(--fg-soft)",
                props.className,
                className,
            )}
        />
    )
}
