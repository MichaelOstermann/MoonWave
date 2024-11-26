import { $playing } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { pausePlayback } from './pausePlayback'
import { resumePlayback } from './resumePlayback'

export const togglePlayback = action(() => {
    $playing.value
        ? pausePlayback()
        : resumePlayback()
})
