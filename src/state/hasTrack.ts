import { computed } from '@app/utils/signals/computed'
import { $playingTrackId } from './playingTrackId'
import { $playingTracks } from './playingTracks'

// TODO
export const $hasTrack = computed<boolean>(() => Boolean($playingTrackId() || $playingTracks().length > 0))
