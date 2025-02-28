import { $loadedAudioMetadata, $playing, audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onAudioPause = action(() => {
    setTimeout(() => {
        // We are loading or playing the next track, skip.
        // This happens when reaching the end of a track - first the `pause` event fires,
        // immediately followed by `ended` which loads the next track asynchronously.
        if (!$loadedAudioMetadata()) return
        if (!audio.paused) return

        $playing.set(false)
    }, 0)
})
