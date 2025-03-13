import { computed } from '@monstermann/signals'
import { $unsortedTrackIds } from './unsortedTrackIds'

export const $unsortedTracksCount = computed(() => $unsortedTrackIds().size)
