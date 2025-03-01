import { audio } from '@app/state/audio'
import { action } from '@app/utils/signals/action'
import { mute } from './mute'
import { unmute } from './unmute'

export const toggleMute = action(() => {
    audio.muted
        ? unmute()
        : mute()
})
