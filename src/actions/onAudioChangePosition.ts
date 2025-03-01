import { audio } from '@app/state/audio'
import { $currentTrackPosition } from '@app/state/currentTrackPosition'
import { $loadedAudioMetadata } from '@app/state/loadedAudioMetadata'
import { action } from '@app/utils/signals/action'

export const onAudioChangePosition = action(() => {
    if (!$loadedAudioMetadata()) return
    $currentTrackPosition.set(audio.currentTime)
})
