import { $isDraggingTracks, $playlists, $tracksLSM } from '@app/state/state'
import { isSelected } from '@app/utils/lsm/utils/isSelected'
import { selectOne } from '@app/utils/lsm/utils/selectOne'
import { action } from '@app/utils/signals/action'
import { onDragEndTracks } from './onDragEndTracks'

export const onDragStartTracks = action((trackId: string) => {
    if ($playlists.value.length === 0) return

    if (!isSelected($tracksLSM.value, trackId))
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
