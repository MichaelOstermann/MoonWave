import { memo } from "@monstermann/signals"
import { Sidebar } from "."

export const $playlistColor = memo(() => {
    return Sidebar.$playlist()?.color
})
