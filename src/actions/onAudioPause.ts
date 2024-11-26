import { $playing } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const onAudioPause = action(() => {
    $playing.set(false)
})
