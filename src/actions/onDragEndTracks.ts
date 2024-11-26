import { $dropPlaylistId, $isDraggingTracks, $tracksLSM } from '@app/state/state'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { action } from '@app/utils/signals/action'
import { addTracksToPlaylist } from './addTracksToPlaylist'

export const onDragEndTracks = action(() => {
    const targetPlaylistId = $dropPlaylistId.value
    const trackIds = getSelections($tracksLSM.value)

    $isDraggingTracks.set(false)

    if (targetPlaylistId)
        addTracksToPlaylist({ trackIds, playlistId: targetPlaylistId })
})
