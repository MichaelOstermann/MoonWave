import { $isPlaying } from '@app/state/audio/isPlaying'
import { $loadedAudioMetadata } from '@app/state/audio/loadedAudioMetadata'
import { action } from '@monstermann/signals'

export const onAudioPlay = action(() => {
    if (!$loadedAudioMetadata()) return
    $isPlaying.set(true)
})
