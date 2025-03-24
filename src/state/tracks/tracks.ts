import type { Track } from '@app/types'
import { onDeleteTracks } from '@app/events'
import { onChange, signal } from '@monstermann/signals'

export const $tracks = signal<Track[]>([])

onChange($tracks, (tracksAfter, tracksBefore) => {
    const trackIdsBefore = new Set(tracksBefore.map(t => t.id))
    const trackIdsAfter = new Set(tracksAfter.map(t => t.id))
    const removedTrackIds = trackIdsBefore.difference(trackIdsAfter)
    if (removedTrackIds.size === 0) return
    onDeleteTracks(removedTrackIds)
})
