import { computed } from '@monstermann/signals'
import { shallowEqualObjects } from 'shallow-equal'
import { $editedTags } from './editedTags'
import { $trackTags } from './trackTags'

export const $hasEditedTags = computed(() => {
    const current = $trackTags()
    const edited = $editedTags()
    return !shallowEqualObjects(current, edited)
})
