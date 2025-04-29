import { Views } from "#features/Views"
import { onDeleteTracks } from "#src/events"
import { Array } from "@monstermann/fn"
import { signal, watch } from "@monstermann/signals"

export const $nextIds = signal<string[]>(Array.empty)

watch(Views.$playing, () => $nextIds(Array.empty))

onDeleteTracks((tids) => {
    $nextIds(Array.removeAll(tids))
})
