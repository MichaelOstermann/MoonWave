import { computed } from '@monstermann/signals'
import { $playingTrackId } from './playingTrackId'
import { $prevPlayedTrackIds } from './prevPlayedTrackIds'

export const $hasPrevTrack = computed<boolean>(() => Boolean($playingTrackId() || $prevPlayedTrackIds().length > 0))
