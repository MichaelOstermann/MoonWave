import type { Track, View } from '@app/types'
import { audio } from '@app/state/audio'
import { $isPlaying } from '@app/state/isPlaying'
import { $loadedAudioMetadata } from '@app/state/loadedAudioMetadata'
import { $playingTrackId } from '@app/state/playingTrackId'
import { $playingView } from '@app/state/playingView'
import { action } from '@app/utils/signals/action'
import { onAudioChangeDuration } from './onAudioChangeDuration'
import { onAudioChangePosition } from './onAudioChangePosition'

export const onPlaybackSuccess = action(({ track, view }: {
    track: Track
    view: View
}) => {
    $loadedAudioMetadata.set(true)
    $isPlaying.set(!audio.paused)
    $playingTrackId.set(track.id)
    $playingView.set(view)

    onAudioChangePosition()
    onAudioChangeDuration()
})
