import { audio } from '@app/state/audio/audio'
import { action } from '@monstermann/signals'

export const stopPlayback = action(() => {
    audio.pause()
    audio.currentTime = 0
})
