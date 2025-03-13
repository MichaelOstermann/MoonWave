import { audio } from '@app/state/audio/audio'
import { $currentTrackDuration } from '@app/state/audio/currentTrackDuration'
import { $loadedAudioMetadata } from '@app/state/audio/loadedAudioMetadata'
import { action } from '@monstermann/signals'

export const onAudioChangeDuration = action(() => {
    if (!$loadedAudioMetadata()) return
    $currentTrackDuration.set(audio.duration)
})
