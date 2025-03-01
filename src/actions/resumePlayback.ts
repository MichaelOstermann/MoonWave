import { audio } from '@app/state/audio'
import { $playingTrackId } from '@app/state/playingTrackId'
import { action } from '@app/utils/signals/action'
import { playNext } from './playNext'

export const resumePlayback = action(() => {
    $playingTrackId()
        ? audio.play()
        : playNext()
})
