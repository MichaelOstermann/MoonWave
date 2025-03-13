import { getPrevTrackId } from '@app/utils/getPrevTrackId'
import { action } from '@monstermann/signals'
import { playTrack } from './playTrack'
import { stopPlayback } from './stopPlayback'

export const playPrev = action(async () => {
    const trackId = getPrevTrackId()
    if (trackId && await playTrack({ trackId })) return
    stopPlayback()
})
