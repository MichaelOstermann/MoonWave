import { audio } from '@app/state/audio/audio'
import { action } from '@monstermann/signals'

export const setVolume = action((value: number) => {
    audio.volume = Math.round(value * 100) / 100
})
