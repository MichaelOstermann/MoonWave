import { audio } from '@app/state/audio'
import { $currentTrackDuration } from '@app/state/currentTrackDuration'
import { $loadedAudioMetadata } from '@app/state/loadedAudioMetadata'
import { action } from '@app/utils/signals/action'

export const onAudioChangeDuration = action(() => {
    if (!$loadedAudioMetadata()) return
    $currentTrackDuration.set(audio.duration)
})
