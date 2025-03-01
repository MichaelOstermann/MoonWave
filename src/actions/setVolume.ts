import { audio } from '@app/state/audio'
import { action } from '@app/utils/signals/action'

export const setVolume = action((value: number) => {
    audio.volume = Math.round(value * 100) / 100
})
