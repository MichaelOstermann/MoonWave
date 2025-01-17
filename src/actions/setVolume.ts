import { audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const setVolume = action((value: number) => {
    audio.volume = Math.round(value * 100) / 100
})
