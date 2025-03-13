import { changeEffect } from '@monstermann/signals'
import { $playingTrackId } from '../tracks/playingTrackId'

export const audio = new Audio()

changeEffect($playingTrackId, (trackId) => {
    if (trackId !== undefined) return
    audio.pause()
    audio.currentTime = 0
})
