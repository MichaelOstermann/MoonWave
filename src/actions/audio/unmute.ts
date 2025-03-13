import { audio } from '@app/state/audio/audio'
import { action } from '@monstermann/signals'

export const unmute = action(() => {
    audio.muted = false
})
