import { audio } from '@app/state/audio'
import { action } from '@app/utils/signals/action'

export const pausePlayback = action(() => {
    audio.pause()
})
