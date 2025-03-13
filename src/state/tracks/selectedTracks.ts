import type { Track } from '@app/types'
import { getSelections } from '@app/utils/lsm/utils/getSelections'
import { computed } from '@monstermann/signals'
import { shallowEqualArrays } from 'shallow-equal'
import { $tracksById } from './tracksById'
import { $tracksLSM } from './tracksLSM'

export const $selectedTracks = computed<Track[]>(() => {
    return getSelections($tracksLSM())
        .map(tid => $tracksById(tid)())
        .filter(track => !!track)
}, { equals: shallowEqualArrays })
