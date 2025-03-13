import { computed } from '@monstermann/signals'
import { $playingTrackId } from './playingTrackId'
import { $playingTracks } from './playingTracks'

// TODO
export const $hasTrack = computed<boolean>(() => Boolean($playingTrackId() || $playingTracks().length > 0))
