import { entriesEqual } from '@app/utils/data/entriesEqual'
import { computed } from '@monstermann/signals'
import { $playlists } from '../playlists/playlists'

export const $sortedTrackIds = computed(() => {
    return $playlists().reduce((acc, p) => {
        return p.trackIds.reduce((acc, tid) => acc.add(tid), acc)
    }, new Set<string>())
}, { equals: entriesEqual })
