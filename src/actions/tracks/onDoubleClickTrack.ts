import { $view } from '@app/state/sidebar/view'
import { action } from '@monstermann/signals'
import { playTrack } from '../audio/playTrack'

export const onDoubleClickTrack = action((trackId: string) => {
    playTrack({
        trackId,
        view: $view(),
    })
})
