import type WaveSurfer from 'wavesurfer.js'
import { signal } from '@app/utils/signals/signal'

export const $wavesurfer = signal<WaveSurfer>(null)
