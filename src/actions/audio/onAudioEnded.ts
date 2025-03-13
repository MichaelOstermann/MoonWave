import { action } from '@monstermann/signals'
import { playNext } from './playNext'

export const onAudioEnded = action(playNext)
