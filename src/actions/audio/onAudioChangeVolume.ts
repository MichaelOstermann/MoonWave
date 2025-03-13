import { audio } from '@app/state/audio/audio'
import { $isMuted } from '@app/state/audio/isMuted'
import { $volume } from '@app/state/audio/volume'
import { action } from '@monstermann/signals'

export const onAudioChangeVolume = action(() => {
    $volume.set(audio.volume)
    $isMuted.set(audio.muted)
})
