import { $nextPlayedTrackIds } from '@app/state/nextPlayedTrackIds'
import { $playingTrackId } from '@app/state/playingTrackId'
import { $prevPlayedTrackIds } from '@app/state/prevPlayedTrackIds'
import { uniq } from '@app/utils/data/uniq'
import { changeEffect } from '@app/utils/signals/changeEffect'

const MAX_SIZE = 100

changeEffect($playingTrackId, (trackId) => {
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
