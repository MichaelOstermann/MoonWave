import { indexSignalBy } from '@app/utils/signals/indexSignalBy'
import { $tracks } from './tracks'

export const $tracksByFilehash = indexSignalBy($tracks, t => t.filehash)
