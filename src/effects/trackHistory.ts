import { $nextPlayedTrackIds } from '@app/state/tracks/nextPlayedTrackIds'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { $prevPlayedTrackIds } from '@app/state/tracks/prevPlayedTrackIds'
import { append } from '@app/utils/data/append'
import { pipe } from '@app/utils/data/pipe'
import { prepend } from '@app/utils/data/prepend'
import { remove } from '@app/utils/data/remove'
import { onChange } from '@monstermann/signals'

const MAX_SIZE = 100

onChange($playingTrackId, (currentTrackId, prevTrackId) => {
    if (!currentTrackId || !prevTrackId) return

    const prevId = $prevPlayedTrackIds().at(-1)
    const nextId = $nextPlayedTrackIds().at(0)

    if (prevId === currentTrackId) {
        $prevPlayedTrackIds.map(ids => ids.slice(0, -1))
        $nextPlayedTrackIds.map(ids => pipe(
            ids,
            ids => remove(ids, prevTrackId),
            ids => prepend(ids, prevTrackId),
        ))
    }

    else if (nextId === currentTrackId) {
        $prevPlayedTrackIds.map(ids => pipe(
            ids,
            ids => remove(ids, prevTrackId),
            ids => append(ids, prevTrackId),
            ids => ids.slice(-MAX_SIZE),
        ))
        $nextPlayedTrackIds.map(ids => ids.slice(1))
    }

    else {
        $prevPlayedTrackIds.map(ids => pipe(
            ids,
            ids => remove(ids, prevTrackId),
            ids => append(ids, prevTrackId),
            ids => ids.slice(-MAX_SIZE),
        ))
        $nextPlayedTrackIds.set([])
    }
})
