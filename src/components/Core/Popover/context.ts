import type { UseTransition } from "#hooks/useTransition"
import type { Popover } from "#src/features/Modals"
import { createContext } from "react"

export const PopoverContext = createContext<{
    popover?: Pick<Popover, "$status" | "$position" | "$floatingElement" | "$isOpen">
    transition?: UseTransition
}>({})
