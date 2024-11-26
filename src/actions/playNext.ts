import { getNextTrackId } from '@app/utils/getNextTrackId'
import { action } from '@app/utils/signals/action'
import { playTrack } from './playTrack'
import { stopPlayback } from './stopPlayback'

export const playNext = action(async () => {
    const failedTrackIds: string[] = []

    while (true) {
        const trackId = getNextTrackId(failedTrackIds)
        if (!trackId) return stopPlayback()
        if (await playTrack({ trackId })) return
        failedTrackIds.push(trackId)
    }
})
