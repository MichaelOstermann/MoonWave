import type { TrackTags } from '@app/state/sidepanel/trackTags'
import { $editedTags } from '@app/state/sidepanel/editedTags'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const setTag = action(({ name, value }: { name: keyof TrackTags, value: string }) => {
    $editedTags.map(merge({
        [name]: value,
    }))
})
