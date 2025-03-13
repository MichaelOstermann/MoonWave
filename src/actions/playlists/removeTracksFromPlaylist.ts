import { $playlists } from '@app/state/playlists/playlists'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { without } from '@app/utils/data/without'
import { action } from '@monstermann/signals'

export const removeTracksFromPlaylist = action(({ trackIds, playlistId }: {
    trackIds: string[]
    playlistId: string
}) => {
    return $playlists.map(findAndMap(
        p => p.id === playlistId,
        p => merge(p, {
            trackIds: without(p.trackIds, trackIds),
        }),
    ))
})
