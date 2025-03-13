import { computed } from '@monstermann/signals'
import { $playingTrackId } from './playingTrackId'
import { $tracksById } from './tracksById'

export const $playingTrack = computed(() => {
    const trackId = $playingTrackId()
    return $tracksById(trackId)()
})
