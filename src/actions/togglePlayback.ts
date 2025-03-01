import { $isPlaying } from '@app/state/isPlaying'
import { action } from '@app/utils/signals/action'
import { pausePlayback } from './pausePlayback'
import { resumePlayback } from './resumePlayback'

export const togglePlayback = action(() => {
    $isPlaying()
        ? pausePlayback()
        : resumePlayback()
})
