import { audio } from '@app/state/audio/audio'
import { action } from '@monstermann/signals'
import { mute } from './mute'
import { unmute } from './unmute'

export const toggleMute = action(() => {
    audio.muted
        ? unmute()
        : mute()
})
