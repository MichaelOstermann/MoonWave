import type { Track, View } from '@app/types'
import { audio } from '@app/state/audio/audio'
import { $isPlaying } from '@app/state/audio/isPlaying'
import { $loadedAudioMetadata } from '@app/state/audio/loadedAudioMetadata'
import { $playingView } from '@app/state/sidebar/playingView'
import { $playingTrackId } from '@app/state/tracks/playingTrackId'
import { action } from '@monstermann/signals'
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
