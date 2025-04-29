import type { Track } from "."
import { Array, withMutations } from "@monstermann/fn"

export function upsert(currentTracks: Track[], newTracks: Track[]): Track[] {
    if (!newTracks.length) return currentTracks
    const idx = Array.indexBy(currentTracks, t => t.id)
    return withMutations(() => {
        return newTracks.reduce((currentTracks, newTrack) => {
            const oldTrack = idx[newTrack.id]
            return oldTrack
                ? Array.replace(currentTracks, oldTrack, newTrack)
                : Array.append(currentTracks, newTrack)
        }, currentTracks)
    })
}
