import { computed } from '@app/utils/signals/computed'
import { $playingTrackId } from './playingTrackId'
import { $playingTracks } from './playingTracks'

export const $hasNextTrack = computed<boolean>(() => Boolean($playingTrackId() && $playingTracks().length > 0))
