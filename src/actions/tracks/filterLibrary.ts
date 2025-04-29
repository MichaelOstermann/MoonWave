import { Sidebar } from "#features/Sidebar"
import { action } from "@monstermann/signals"

export const filterLibrary = action((filter: string) => {
    Sidebar.$search(filter)
})
