import { audio } from '@app/state/audio/audio'
import { action } from '@monstermann/signals'

export const mute = action(() => {
    audio.muted = true
})
