import { computed } from '@monstermann/signals'
import { $playingTrackId } from './playingTrackId'
import { $playingTracks } from './playingTracks'

export const $hasNextTrack = computed<boolean>(() => Boolean($playingTrackId() && $playingTracks().length > 0))
