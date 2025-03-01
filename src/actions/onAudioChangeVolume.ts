import { audio } from '@app/state/audio'
import { $isMuted } from '@app/state/isMuted'
import { $volume } from '@app/state/volume'
import { action } from '@app/utils/signals/action'

export const onAudioChangeVolume = action(() => {
    $volume.set(audio.volume)
    $isMuted.set(audio.muted)
})
