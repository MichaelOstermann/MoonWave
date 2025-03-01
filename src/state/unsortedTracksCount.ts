import { computed } from '@app/utils/signals/computed'
import { $unsortedTrackIds } from './unsortedTrackIds'

export const $unsortedTracksCount = computed(() => $unsortedTrackIds().size)
