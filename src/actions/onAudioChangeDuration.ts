import { $currentTrackDuration, $loadedAudioMetadata, audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onAudioChangeDuration = action(() => {
    if (!$loadedAudioMetadata.value) return
    $currentTrackDuration.set(audio.duration)
})
