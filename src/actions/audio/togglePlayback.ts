import { $isPlaying } from '@app/state/audio/isPlaying'
import { action } from '@monstermann/signals'
import { pausePlayback } from './pausePlayback'
import { resumePlayback } from './resumePlayback'

export const togglePlayback = action(() => {
    $isPlaying()
        ? pausePlayback()
        : resumePlayback()
})
