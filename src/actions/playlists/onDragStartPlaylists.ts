import { $draggingPlaylistIds } from '@app/state/playlists/draggingPlaylistIds'
import { action } from '@monstermann/signals'
import { onDragEndPlaylists } from './onDragEndPlaylists'

export const onDragStartPlaylists = action((playlistId: string) => {
    $draggingPlaylistIds.set([playlistId])

    const ac = new AbortController()
    document.body.classList.add('!cursor-default')
    document.addEventListener('pointerup', () => {
        ac.abort()
        document.body.classList.remove('!cursor-default')
        onDragEndPlaylists()
    }, { signal: ac.signal })
})
