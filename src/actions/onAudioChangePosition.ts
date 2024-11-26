import { $currentTrackPosition, $loadedAudioMetadata, audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onAudioChangePosition = action(() => {
    if (!$loadedAudioMetadata.value) return
    $currentTrackPosition.set(audio.currentTime)
})
