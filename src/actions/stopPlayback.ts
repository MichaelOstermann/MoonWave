import { audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const stopPlayback = action(() => {
    audio.pause()
    audio.currentTime = 0
})
