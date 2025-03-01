import { indexSignalBy } from '@app/utils/signals/indexSignalBy'
import { $tracks } from './tracks'

export const $tracksById = indexSignalBy($tracks, t => t.id)
