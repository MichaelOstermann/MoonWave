import { computed } from '@app/utils/signals/computed'
import { $playingTrackId } from './playingTrackId'
import { $prevPlayedTrackIds } from './prevPlayedTrackIds'

export const $hasPrevTrack = computed<boolean>(() => Boolean($playingTrackId() || $prevPlayedTrackIds().length > 0))
