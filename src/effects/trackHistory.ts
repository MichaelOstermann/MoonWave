import { $nextPlayedTrackIds } from '@app/state/tracks/nextPlayedTrackIds'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { $prevPlayedTrackIds } from '@app/state/tracks/prevPlayedTrackIds'
import { uniq } from '@app/utils/data/uniq'
import { onChange } from '@monstermann/signals'

const MAX_SIZE = 100

onChange($playingTrackId, (trackId) => {
    if (!trackId) return

    const prevIds = $prevPlayedTrackIds()
    const nextIds = $nextPlayedTrackIds()

    if (prevIds.at(-1) === trackId) {
        $prevPlayedTrackIds.set(prevIds.slice(1))
        $nextPlayedTrackIds.set(uniq([trackId, ...nextIds]))
    }
    else if (nextIds.at(0) === trackId) {
        $prevPlayedTrackIds.set(uniq([trackId, ...prevIds]))
        $nextPlayedTrackIds.set(nextIds.slice(1))
    }
    else {
        $prevPlayedTrackIds.set(uniq([trackId, ...prevIds]).slice(0, MAX_SIZE))
        $nextPlayedTrackIds.set([])
    }
})
