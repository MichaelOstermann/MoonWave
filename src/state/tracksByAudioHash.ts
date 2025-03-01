import { indexSignalBy } from '@app/utils/signals/indexSignalBy'
import { $tracks } from './tracks'

export const $tracksByAudiohash = indexSignalBy($tracks, t => t.audiohash)
