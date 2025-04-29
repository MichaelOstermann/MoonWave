import { Views } from "#features/Views"
import { onDeleteTracks } from "#src/events"
import { Array } from "@monstermann/fn"
import { signal, watch } from "@monstermann/signals"

export const $prevIds = signal<string[]>(Array.empty)

watch(Views.$playing, () => $prevIds(Array.empty))

onDeleteTracks((tids) => {
    $prevIds(Array.removeAll(tids))
})
