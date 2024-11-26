import { audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const pausePlayback = action(() => {
    audio.pause()
})
