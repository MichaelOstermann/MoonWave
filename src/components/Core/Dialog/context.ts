import type { UseTransition } from "#hooks/useTransition"
import type { Dialog } from "#src/features/Modals"
import { createContext } from "react"

export const DialogContext = createContext<{
    dialog?: Dialog
    transition?: UseTransition
}>({})
