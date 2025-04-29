import { noop } from "@monstermann/fn"
import { createContext } from "react"

export const ButtonGroupContext = createContext<{
    isActive: boolean
    onResize: (width: number) => void
    setActive: () => void
}>({
    isActive: false,
    onResize: noop,
    setActive: noop,
})
