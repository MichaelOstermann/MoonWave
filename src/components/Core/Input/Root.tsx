import type { ComponentProps, ReactNode } from "react"
import type { UseInput } from "./useInput"
import { twMerge } from "tailwind-merge"
import { InputContext } from "./contexts"

interface RootProps extends ComponentProps<"div"> {
    input: UseInput
}

export function Root({
    className,
    input,
    ...rest
}: RootProps): ReactNode {
    return (
        <InputContext value={input}>
            <div
                {...rest}
                className={twMerge(
                    "group relative flex shrink grow border border-(--border) rounded-md bg-(--bg-soft) focus-within:bg-transparent focus-within:shadow-[0_0_0_2px_var(--accent)]",
                    className,
                )}
            />
        </InputContext>
    )
}
