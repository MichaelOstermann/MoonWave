import type { Track, View } from '@app/types'
import { $loadedAudioMetadata, $playing, $playingTrackId, $playingView, audio } from '@app/state/state'
import { addPrevPlayedTrackId } from '@app/utils/addPrevPlayedTrackId'
import { action } from '@app/utils/signals/action'
import { onAudioChangeDuration } from './onAudioChangeDuration'
import { onAudioChangePosition } from './onAudioChangePosition'

export const onPlaybackSuccess = action(({ track, view }: {
    track: Track
    view: View
}) => {
    $loadedAudioMetadata.set(true)
    $playing.set(!audio.paused)
    $playingTrackId.set(track.id)
    $playingView.set(view)

    onAudioChangePosition()
    onAudioChangeDuration()
    addPrevPlayedTrackId(track.id)
})
