import { action } from '@app/utils/signals/action'
import { playNext } from './playNext'

export const onAudioEnded = action(playNext)
