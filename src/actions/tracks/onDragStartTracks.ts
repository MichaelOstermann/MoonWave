import { LSM } from "#features/LSM"
import { Playlists } from "#features/Playlists"
import { TrackList } from "#features/TrackList"
import { action } from "@monstermann/signals"
import { onDragEndTracks } from "./onDragEndTracks"

export const onDragStartTracks = action((trackId: string) => {
    if (Playlists.$all().length === 0) return

    if (!LSM.isSelected(TrackList.$LSM(), trackId))
        TrackList.$LSM(lsm => LSM.selectOne(lsm, trackId))

    TrackList.$isDragging(true)

    const ac = new AbortController()
    document.addEventListener("pointerup", () => {
        ac.abort()
        onDragEndTracks()
    }, { signal: ac.signal })
})
