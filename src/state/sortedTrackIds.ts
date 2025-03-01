import { entriesEqual } from '@app/utils/data/entriesEqual'
import { computed } from '@app/utils/signals/computed'
import { $playlists } from './playlists'

export const $sortedTrackIds = computed(() => {
    return $playlists().reduce((acc, p) => {
        return p.trackIds.reduce((acc, tid) => acc.add(tid), acc)
    }, new Set<string>())
}, { equals: entriesEqual })
