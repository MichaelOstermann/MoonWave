import { $playingTrackId, audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { playNext } from './playNext'

export const resumePlayback = action(() => {
    $playingTrackId.value
        ? audio.play()
        : playNext()
})
