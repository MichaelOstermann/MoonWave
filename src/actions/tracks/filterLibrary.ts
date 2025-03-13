import { $tracksFilter } from '@app/state/tracks/tracksFilter'
import { action } from '@monstermann/signals'

export const filterLibrary = action((filter: string) => {
    $tracksFilter.set(filter)
})
