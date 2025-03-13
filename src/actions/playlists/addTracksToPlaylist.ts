import { $playlists } from '@app/state/playlists/playlists'
import { findAndMap } from '@app/utils/data/findAndMap'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const addTracksToPlaylist = action(({ trackIds, playlistId }: {
    trackIds: string[]
    playlistId: string
}) => {
    $playlists.map(findAndMap(
        p => p.id === playlistId,
        p => merge(p, {
            trackIds: p.trackIds.concat(trackIds.filter(tid => !p.trackIds.includes(tid))),
        }),
    ))
})
