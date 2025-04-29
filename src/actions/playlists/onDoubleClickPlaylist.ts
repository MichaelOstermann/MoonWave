import type { View } from "#src/features/Views"
import { playNext } from "#actions/audio/playNext"
import { Views } from "#src/features/Views"
import { action } from "@monstermann/signals"

export const onDoubleClickPlaylist = action((view: View): void => {
    Views.$playing(view)
    // Let the TrackHistory.$nextQueue effects run first, then we can extract the next track to play.
    queueMicrotask(playNext)
})
