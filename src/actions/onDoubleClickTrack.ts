import { $view } from '@app/state/state'
import { action } from '@app/utils/signals/action'
import { playTrack } from './playTrack'

export const onDoubleClickTrack = action((trackId: string) => {
    playTrack({
        trackId,
        view: $view.value,
    })
})
