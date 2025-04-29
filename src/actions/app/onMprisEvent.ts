import { playNext } from "#actions/audio/playNext"
import { playPrev } from "#actions/audio/playPrev"
import { match } from "@monstermann/fn"
import { action } from "@monstermann/signals"

type MprisEvent =
    | "next"
    | "previous"

export const onMprisEvent = action((event: MprisEvent): void => {
    match(event)
        .onCase("next", playNext)
        .onCase("previous", playPrev)
        .orThrow()
})
