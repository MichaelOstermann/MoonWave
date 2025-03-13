import { entriesEqual } from '@app/utils/data/entriesEqual'
import { computed } from '@monstermann/signals'
import { $sortedTrackIds } from './sortedTrackIds'
import { $tracks } from './tracks'

export const $unsortedTrackIds = computed(() => {
    const sortedTrackIds = $sortedTrackIds()
    return $tracks().reduce((acc, t) => {
        if (!sortedTrackIds.has(t.id)) acc.add(t.id)
        return acc
    }, new Set<string>())
}, { equals: entriesEqual })
