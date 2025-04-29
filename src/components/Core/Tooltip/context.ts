import type { UseTransition } from "#hooks/useTransition"
import type { Tooltip } from "#src/features/Modals"
import { createContext } from "react"

export const TooltipContext = createContext<{
    tooltip?: Tooltip
    transition?: UseTransition
}>({})
