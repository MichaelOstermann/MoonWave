import { indexSignalBy } from '@monstermann/signals'
import { $tracks } from './tracks'

export const $tracksById = indexSignalBy($tracks, t => t.id)
