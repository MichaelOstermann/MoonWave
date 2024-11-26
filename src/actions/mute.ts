import { audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const mute = action(() => {
    audio.muted = true
})
