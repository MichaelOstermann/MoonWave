import type { Track } from "."
import { onDeleteTracks } from "#src/events"
import { Set } from "@monstermann/fn"
import { signal, watch } from "@monstermann/signals"

export const $all = signal<Track[]>([])

watch($all, (tracksAfter, tracksBefore) => {
    const trackIdsBefore = Set.create(tracksBefore.map(t => t.id))
    const trackIdsAfter = Set.create(tracksAfter.map(t => t.id))
    const removedTrackIds = Set.difference(trackIdsBefore, trackIdsAfter)
    if (removedTrackIds.size === 0) return
    onDeleteTracks(removedTrackIds)
})
