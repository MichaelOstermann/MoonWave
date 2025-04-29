import type { ComponentProps, ReactNode } from "react"
import { use } from "react"
import { twMerge } from "tailwind-merge"
import { InputContext } from "./contexts"

interface RightProps extends ComponentProps<"div"> {
    show?: boolean
}

export function Right({
    className,
    onPointerDown,
    show = true,
    ...rest
}: RightProps): ReactNode {
    const { props } = use(InputContext)

    return (
        <div
            {...rest}
            data-show={show}
            className={twMerge(
                "absolute right-0 flex scale-0 items-center justify-center transition-transform duration-300 ease-in-out data-[show=true]:scale-100",
                className,
            )}
            onPointerDown={(evt) => {
                evt.preventDefault()
                if (!show || props.disabled) return
                onPointerDown?.(evt)
            }}
        />
    )
}
