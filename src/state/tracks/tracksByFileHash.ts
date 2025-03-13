import { indexSignalBy } from '@monstermann/signals'
import { $tracks } from './tracks'

export const $tracksByFilehash = indexSignalBy($tracks, t => t.filehash)
