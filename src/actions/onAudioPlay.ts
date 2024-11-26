import { $loadedAudioMetadata, $playing } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onAudioPlay = action(() => {
    if (!$loadedAudioMetadata.value) return
    $playing.set(true)
})
