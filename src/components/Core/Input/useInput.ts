import type { ComponentProps, KeyboardEvent } from "react"
import { useState } from "react"

interface UseInputOpts extends ComponentProps<"input"> {
    onEscape?: (evt: KeyboardEvent<HTMLInputElement>) => void
    onUpdate?: (value: string) => void
}

export type UseInput = {
    input: HTMLInputElement | null
    props: ComponentProps<"input">
}

export function useInput({
    onEscape,
    onUpdate,
    ...props
}: UseInputOpts): UseInput {
    const [input, setInput] = useState<HTMLInputElement | null>(null)

    return {
        input,
        props: {
            ...props,
            onChange: (evt) => {
                props.onChange?.(evt)
                onUpdate?.(evt.target.value)
            },
            onContextMenu: (evt) => {
                evt.stopPropagation()
                props.onContextMenu?.(evt)
            },
            onKeyDown: (evt) => {
                props.onKeyDown?.(evt)
                if (evt.key === "Escape") onEscape?.(evt)
            },
            ref: (input) => {
                setInput(input)
            },
        },
    }
}
