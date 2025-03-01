import { audio } from '@app/state/audio'
import { action } from '@app/utils/signals/action'

export const seekTo = action((value: number) => {
    audio.currentTime = value
})
