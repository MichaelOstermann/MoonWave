import { createContext } from 'react'

export const ButtonGroupButtonContext = createContext({
    index: -1,
})

export const ButtonGroupContext = createContext<{
    active: number
    onSelect: (index: number) => void
    registerElement: (index: number, element: Element | null) => void
}>({
            active: -1,
            onSelect: () => {},
            registerElement: () => {},
        })
