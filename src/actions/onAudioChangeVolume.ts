import { $muted, $volume, audio } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onAudioChangeVolume = action(() => {
    $volume.set(audio.volume)
    $muted.set(audio.muted)
})
