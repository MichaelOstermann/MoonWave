import { $isDraggingTracks } from '@app/state/isDraggingTracks'
import { $playlists } from '@app/state/playlists'
import { $tracksLSM } from '@app/state/tracksLSM'
import { isSelected } from '@app/utils/lsm/utils/isSelected'
import { selectOne } from '@app/utils/lsm/utils/selectOne'
import { action } from '@app/utils/signals/action'
import { onDragEndTracks } from './onDragEndTracks'

export const onDragStartTracks = action((trackId: string) => {
    if ($playlists().length === 0) return

    if (!isSelected($tracksLSM(), trackId))
        $tracksLSM.map(lsm => selectOne(lsm, trackId))

    $isDraggingTracks.set(true)

    const ac = new AbortController()
    document.body.classList.add('!cursor-default')
    document.addEventListener('pointerup', () => {
        ac.abort()
        document.body.classList.remove('!cursor-default')
        onDragEndTracks()
    }, { signal: ac.signal })
})
