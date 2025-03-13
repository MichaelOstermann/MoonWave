import { audio } from '@app/state/audio/audio'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { action } from '@monstermann/signals'
import { playNext } from './playNext'

export const resumePlayback = action(() => {
    $playingTrackId()
        ? audio.play()
        : playNext()
})
