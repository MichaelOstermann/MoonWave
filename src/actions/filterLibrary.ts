import { $tracksFilter } from '@app/state/tracksFilter'
import { action } from '@app/utils/signals/action'

export const filterLibrary = action((filter: string) => {
    $tracksFilter.set(filter)
})
