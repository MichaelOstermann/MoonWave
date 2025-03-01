import { glide } from '@app/config/easings'
import { $dropPlaylistId } from '@app/state/dropPlaylistId'
import { $isDraggingTracks } from '@app/state/isDraggingTracks'
import { $tracksLSM } from '@app/state/tracksLSM'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { action } from '@app/utils/signals/action'
import { addTracksToPlaylist } from './addTracksToPlaylist'

export const onDragEndTracks = action(() => {
    const targetPlaylistId = $dropPlaylistId()
    const trackIds = getSelections($tracksLSM())

    $isDraggingTracks.set(false)

    if (targetPlaylistId) {
        addTracksToPlaylist({ trackIds, playlistId: targetPlaylistId })
        document.querySelector(`[data-playlist-id="${targetPlaylistId}"]`)?.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(.96)' },
            { transform: 'scale(1)' },
        ], { duration: 1000, easing: glide })
    }
})
