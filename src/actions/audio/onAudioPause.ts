import { audio } from '@app/state/audio/audio'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $loadedAudioMetadata } from '@app/state/audio/loadedAudioMetadata'
import { action } from '@monstermann/signals'

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
