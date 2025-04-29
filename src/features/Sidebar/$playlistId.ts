import { Views } from "#features/Views"
import { memo } from "@monstermann/signals"

export const $playlistId = memo(() => {
    const view = Views.$selected()
    if (view.name !== "PLAYLIST") return undefined
    return view.value
})
