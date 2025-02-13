import { $draggingPlaylistIds } from '@app/state/state'
import { action } from '@app/utils/signals/action'
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
