import { changeEffect } from '@app/utils/signals/changeEffect'
import { $playingTrackId } from './playingTrackId'

export const audio = new Audio()

changeEffect($playingTrackId, (trackId) => {
    if (trackId !== undefined) return
    audio.pause()
    audio.currentTime = 0
})
