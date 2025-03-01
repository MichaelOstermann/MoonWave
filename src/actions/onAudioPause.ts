import { audio } from '@app/state/audio'
import { $isPlaying } from '@app/state/isPlaying'
import { $loadedAudioMetadata } from '@app/state/loadedAudioMetadata'
import { action } from '@app/utils/signals/action'

export const onAudioPause = action(() => {
    setTimeout(() => {
        // We are loading or playing the next track, skip.
        // This happens when reaching the end of a track - first the `pause` event fires,
        // immediately followed by `ended` which loads the next track asynchronously.
        if (!$loadedAudioMetadata()) return
        if (!audio.paused) return

        $isPlaying.set(false)
    }, 0)
})
