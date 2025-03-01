import { $isPlaying } from '@app/state/isPlaying'
import { $loadedAudioMetadata } from '@app/state/loadedAudioMetadata'
import { action } from '@app/utils/signals/action'

export const onAudioPlay = action(() => {
    if (!$loadedAudioMetadata()) return
    $isPlaying.set(true)
})
