import type { AudioMetadata, Track } from "."
import { Array, Object, withMutations } from "@monstermann/fn"

export function updateMetadata(tracks: Track[], metadata: AudioMetadata[]): Track[] {
    if (!metadata.length) return tracks
    const idx = Array.indexBy(tracks, t => t.path)
    return withMutations(() => {
        return metadata.reduce((tracks, metadata) => {
            const oldTrack = idx[metadata.path]
            if (!oldTrack) return tracks
            const newTrack = Object.merge(oldTrack, metadata)
            return Array.replace(tracks, oldTrack, newTrack)
        }, tracks)
    })
}
