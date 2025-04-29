import { memo } from "@monstermann/signals"
import { Sidebar } from "."

export const $playlistIcon = memo(() => {
    return Sidebar.$playlist()?.icon
})
