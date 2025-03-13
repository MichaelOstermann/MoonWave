import { audio } from '@app/state/audio/audio'
import { action } from '@monstermann/signals'

export const seekTo = action((value: number) => {
    audio.currentTime = value
})
