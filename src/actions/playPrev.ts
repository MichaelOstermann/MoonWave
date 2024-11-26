import { getPrevTrackId } from '@app/utils/getPrevTrackId'
import { action } from '@app/utils/signals/action'
import { playTrack } from './playTrack'
import { stopPlayback } from './stopPlayback'

export const playPrev = action(async () => {
    const trackId = getPrevTrackId()
    if (trackId && await playTrack({ trackId })) return
    stopPlayback()
})
