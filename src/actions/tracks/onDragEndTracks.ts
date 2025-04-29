import { LSM } from "#features/LSM"
import { Playlists } from "#features/Playlists"
import { Sidebar } from "#features/Sidebar"
import { TrackList } from "#features/TrackList"
import { action } from "@monstermann/signals"
import { addTracksToPlaylist } from "../playlists/addTracksToPlaylist"

export const onDragEndTracks = action(() => {
    const targetPlaylistId = Sidebar.$dropId()
    const trackIds = LSM.getSelections(TrackList.$LSM())

    TrackList.$isDragging(false)

    if (targetPlaylistId) {
        addTracksToPlaylist({ playlistId: targetPlaylistId, trackIds })
        Playlists.bounce(targetPlaylistId)
    }
})
