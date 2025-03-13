import { audio } from '@app/state/audio/audio'
import { $currentTrackPosition } from '@app/state/audio/currentTrackPosition'
import { $loadedAudioMetadata } from '@app/state/audio/loadedAudioMetadata'
import { action } from '@monstermann/signals'

export const onAudioChangePosition = action(() => {
    if (!$loadedAudioMetadata()) return
    $currentTrackPosition.set(audio.currentTime)
})
