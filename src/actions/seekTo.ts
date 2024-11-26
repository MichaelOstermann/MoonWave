import { audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const seekTo = action((value: number) => {
    audio.currentTime = value
})
