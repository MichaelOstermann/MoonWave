import { $tracksFilter } from '@app/state/state'
import { action } from '@app/utils/signals/action'

export const filterLibrary = action((filter: string) => {
    $tracksFilter.set(filter)
})
