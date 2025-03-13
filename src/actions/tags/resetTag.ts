import type { TrackTags } from '@app/state/sidepanel/trackTags'
import { $editedTags } from '@app/state/sidepanel/editedTags'
import { $trackTags } from '@app/state/sidepanel/trackTags'
import { merge } from '@app/utils/data/merge'
import { action } from '@monstermann/signals'

export const resetTag = action(({ name }: { name: keyof TrackTags }) => {
    $editedTags.map(merge({
        [name]: $trackTags()[name],
    }))
})
