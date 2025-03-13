import type { ComponentProps, KeyboardEvent } from 'react'
import { useState } from 'react'

interface UseInputOpts extends ComponentProps<'input'> {
    onUpdate?: (value: string) => void
    onEscape?: (evt: KeyboardEvent<HTMLInputElement>) => void
}

export type UseInput = {
    props: ComponentProps<'input'>
    input: HTMLInputElement | null
}

export function useInput({
    onUpdate,
    onEscape,
    ...props
}: UseInputOpts): UseInput {
    const [input, setInput] = useState<HTMLInputElement | null>(null)

    return {
        input,
        props: {
            ...props,
            ref: (input) => {
                setInput(input)
            },
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
                if (evt.key === 'Escape') onEscape?.(evt)
            },
        },
    }
}
