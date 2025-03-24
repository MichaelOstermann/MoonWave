import { onChange } from '@monstermann/signals'
import { $playingTrackId } from '../tracks/playingTrackId'

export const audio = new Audio()

onChange($playingTrackId, (trackId) => {
    if (trackId !== undefined) return
    audio.pause()
    audio.currentTime = 0
})
